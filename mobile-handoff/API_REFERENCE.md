# Studer Backend — API Reference

Base URL (dev): `http://localhost:8000`
Interactive docs: `http://localhost:8000/docs`

---

## Authentication

All endpoints except `GET /health` require a Supabase JWT in the Authorization header:

```
Authorization: Bearer <supabase_session.access_token>
```

Get the token from the Supabase client after sign-in:

```typescript
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token
```

**Error responses:**
- `403 Forbidden` — Authorization header missing
- `401 Unauthorized` — Token invalid or expired

---

## Endpoints

### GET /health
No auth required.

**Response 200**
```json
{ "status": "ok" }
```

---

### POST /collections
Create a study collection.

**Request**
```json
{ "name": "Biology 101" }
```

**Response 201**
```json
{
  "id": "uuid",
  "name": "Biology 101",
  "created_at": "2026-05-18T10:00:00Z",
  "document_count": 0
}
```

---

### GET /collections
List all collections for the authenticated user.

**Response 200** — array of collection objects (same shape as POST response)
```json
[
  {
    "id": "uuid",
    "name": "Biology 101",
    "created_at": "2026-05-18T10:00:00Z",
    "document_count": 2
  }
]
```

---

### POST /collections/{id}/documents
Upload a PDF to a collection. Send as `multipart/form-data`.

**Request** — `file` field (PDF, max 10 MB, `content-type: application/pdf`)

**Response 200**
```json
{
  "document_id": "uuid",
  "filename": "chapter1.pdf",
  "page_count": 12,
  "extracted_text": "...",
  "summary": [
    "First key point from the document.",
    "Second key point from the document.",
    "Third key point from the document."
  ]
}
```

**Errors**
- `400` — wrong content-type or file exceeds 10 MB
- `404` — collection not found / not owned by user
- `422` — PDF could not be parsed
- `502` — AI summarisation failed

---

### GET /collections/{id}/documents
List documents in a collection.

**Response 200**
```json
[
  {
    "id": "uuid",
    "filename": "chapter1.pdf",
    "page_count": 12,
    "created_at": "2026-05-18T10:00:00Z"
  }
]
```

---

### POST /collections/{id}/generate
Generate multiple-choice questions from all documents in a collection.

**Query param (optional):** `count` (int, default 5) — number of questions to generate

**Response 201**
```json
{
  "collection_id": "uuid",
  "questions_generated": 5,
  "questions": [
    {
      "id": "uuid",
      "question_text": "What is the powerhouse of the cell?",
      "options": ["A) Nucleus", "B) Mitochondria", "C) Ribosome", "D) Golgi"],
      "correct_option": 1,
      "explanation": "The mitochondria produces ATP via cellular respiration.",
      "difficulty": "easy",
      "topic_tag": "cell biology",
      "created_at": "2026-05-18T10:00:00Z"
    }
  ]
}
```

**Errors**
- `400` — collection has no documents, or no indexed text found
- `502` — AI question generation failed

---

### GET /collections/{id}/questions
List all generated questions for a collection.

**Response 200** — array of question objects (same shape as above)

---

### POST /answers
Record the user's answer to a question.

**Request**
```json
{
  "question_id": "uuid",
  "answered_option": 1
}
```

`answered_option` is 0-indexed (0 = A, 1 = B, 2 = C, 3 = D).

**Response 201**
```json
{
  "id": "uuid",
  "question_id": "uuid",
  "answered_option": 1,
  "is_correct": true,
  "correct_option": 1,
  "explanation": "The mitochondria produces ATP via cellular respiration.",
  "answered_at": "2026-05-18T10:01:00Z"
}
```

**Errors**
- `404` — question not found

---

### GET /users/me/stats
Accuracy stats for the authenticated user.

**Response 200**
```json
{
  "total_answered": 20,
  "total_correct": 14,
  "accuracy": 0.7,
  "by_topic": [
    {
      "topic_tag": "cell biology",
      "total": 10,
      "correct": 8,
      "accuracy": 0.8
    },
    {
      "topic_tag": null,
      "total": 10,
      "correct": 6,
      "accuracy": 0.6
    }
  ]
}
```

> **Note:** The mobile spec's `Stats` TypeScript interface uses different field names
> (`accuracy_overall`, `streak_days`, `questions_answered`, `weak_topics`). Those are
> wrong — use the shape above. Streaks are not implemented in v1.

---

### POST /notifications/register
Store or update the user's Expo push token. Call this once after login.

**Request**
```json
{ "expo_push_token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]" }
```

**Response 201**
```json
{
  "user_id": "uuid",
  "expo_push_token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

---

## TypeScript types (corrected)

```typescript
interface Collection {
  id: string;
  name: string;
  created_at: string;
  document_count: number;
  // note: question_count is NOT returned by the backend
}

interface Document {
  id: string;
  filename: string;
  page_count: number;
  created_at: string;
}

interface Question {
  id: string;
  question_text: string;
  options: string[];          // always 4 items: ["A) ...", "B) ...", "C) ...", "D) ..."]
  correct_option: number;     // 0-indexed — reveal only after answering
  explanation: string;        // reveal only after answering
  difficulty: 'easy' | 'medium' | 'hard';
  topic_tag: string | null;
  created_at: string;
}

interface AnswerResponse {
  id: string;
  question_id: string;
  answered_option: number;
  is_correct: boolean;
  correct_option: number;
  explanation: string;
  answered_at: string;
}

interface TopicStat {
  topic_tag: string | null;
  total: number;
  correct: number;
  accuracy: number;           // 0.0–1.0
}

interface StatsResponse {
  total_answered: number;
  total_correct: number;
  accuracy: number;           // 0.0–1.0
  by_topic: TopicStat[];
}
```

---

## Suggested API client skeleton (services/api.ts)

```typescript
import { API_BASE_URL } from '../constants/config';
import { supabase } from './supabase';

async function authHeader(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  return { Authorization: `Bearer ${session.access_token}` };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { ...(await authHeader()), 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { ...(await authHeader()), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

async function postForm<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: await authHeader(),   // no Content-Type — let fetch set multipart boundary
    body: form,
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export const api = {
  collections: {
    list: () => get<Collection[]>('/collections'),
    create: (name: string) => post<Collection>('/collections', { name }),
    uploadDocument: (id: string, file: FormData) =>
      postForm<{ document_id: string; summary: string[] }>(`/collections/${id}/documents`, file),
    generateQuestions: (id: string, count = 5) =>
      post<{ questions_generated: number; questions: Question[] }>(
        `/collections/${id}/generate?count=${count}`, {}
      ),
    questions: (id: string) => get<Question[]>(`/collections/${id}/questions`),
  },
  answers: {
    record: (question_id: string, answered_option: number) =>
      post<AnswerResponse>('/answers', { question_id, answered_option }),
  },
  users: {
    stats: () => get<StatsResponse>('/users/me/stats'),
  },
  notifications: {
    register: (expo_push_token: string) =>
      post('/notifications/register', { expo_push_token }),
  },
};
```
