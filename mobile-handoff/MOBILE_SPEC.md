# Studer Mobile — Full Project Spec

## Context

React Native (Expo) mobile app for the Studer study assistant.
Consumes the Studer backend API (separate repo). Users upload PDFs,
group them into study collections, and receive push notifications with
AI-generated quiz questions for active recall learning.

**v1 scope:** Auth + collections + PDF upload + question answering + push notifications.
Notion integration and spaced repetition algorithm are post-v1.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | React Native with Expo (managed workflow) |
| Navigation | Expo Router (file-based) |
| Auth | Supabase Auth (email/password + OAuth via Google/Apple) |
| Backend client | Typed fetch wrapper over Studer FastAPI |
| State management | React Context + SWR for server state |
| Push notifications | Expo Notifications |
| Styling | NativeWind (Tailwind for React Native) |
| Storage | Supabase client (reads directly for auth state) |
| Testing | Jest + React Native Testing Library |

---

## Project Structure

```
studer-mobile/
├── app/                        ← Expo Router file-based routes
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx           ← Today's questions
│   │   ├── collections.tsx     ← All study collections
│   │   └── progress.tsx        ← Accuracy + streaks
│   ├── collection/
│   │   ├── [id].tsx            ← Collection detail (docs + questions)
│   │   └── new.tsx             ← Create collection form
│   └── _layout.tsx             ← Root layout (auth guard)
├── components/
│   ├── QuestionCard.tsx
│   ├── CollectionCard.tsx
│   ├── ProgressBar.tsx
│   └── ui/                     ← Buttons, inputs, modals
├── services/
│   ├── api.ts                  ← Typed API client for Studer backend
│   └── supabase.ts             ← Supabase client (auth only)
├── hooks/
│   ├── useAuth.ts
│   ├── useCollections.ts
│   └── useQuestions.ts
├── constants/
│   └── config.ts               ← API_BASE_URL, Supabase config
├── app.json
└── package.json
```

---

## Screens

### Auth Flow (unauthenticated)
- **Login** — email/password form + Google OAuth button
- **Register** — email/password + confirm password

### Main Tabs (authenticated)

#### Today (`/`)
- Shows 1 pending question from any active collection
- Multiple-choice answer buttons (A/B/C/D)
- After answer: show correct/incorrect + explanation
- "Next question" button

#### Collections (`/collections`)
- List of user's study collections (name, doc count, question count)
- FAB to create new collection
- Tap → Collection Detail screen

#### Progress (`/progress`)
- Accuracy % overall and per topic
- Study streak (days in a row with ≥1 answer)
- Total questions answered
- Weak topics list (topics with <60% accuracy)

### Collection Detail (`/collection/[id]`)
- Collection name + document list
- "Upload PDF" button (opens file picker → POST to backend)
- "Generate Questions" button (POST `/collections/{id}/generate`)
- Question list with difficulty badges

### Create Collection (`/collection/new`)
- Name input → POST `/collections`
- Redirect to Collection Detail on success

---

## Push Notifications

On first launch (after login):
1. Request notification permission (`Expo.Notifications.requestPermissionsAsync()`)
2. Get push token (`Expo.Notifications.getExpoPushTokenAsync()`)
3. POST token to `POST /notifications/register` on backend
4. Backend sends questions on schedule; tapping notification deep-links to Today tab

---

## API Client (services/api.ts)

Typed wrapper using `fetch`. Automatically attaches `Authorization: Bearer <supabase_jwt>`.

```typescript
const api = {
  collections: {
    list: () => get<Collection[]>('/collections'),
    create: (name: string) => post<Collection>('/collections', { name }),
    uploadDocument: (id: string, file: FormData) =>
      postForm<Document>(`/collections/${id}/documents`, file),
    generateQuestions: (id: string) =>
      post<Question[]>(`/collections/${id}/generate`, {}),
    questions: (id: string) =>
      get<Question[]>(`/collections/${id}/questions`),
  },
  answers: {
    record: (question_id: string, answered_option: number) =>
      post('/answers', { question_id, answered_option }),
  },
  users: {
    stats: () => get<Stats>('/users/me/stats'),
  },
  notifications: {
    register: (expo_push_token: string) =>
      post('/notifications/register', { expo_push_token }),
  },
}
```

---

## Data Types (TypeScript)

```typescript
interface Collection {
  id: string;
  name: string;
  created_at: string;
  document_count?: number;
  question_count?: number;
}

interface Document {
  id: string;
  collection_id: string;
  filename: string;
  page_count: number;
  created_at: string;
}

interface Question {
  id: string;
  collection_id: string;
  question_text: string;
  options: string[];           // ["A) ...", "B) ...", "C) ...", "D) ..."]
  correct_option: number;      // revealed after answering
  explanation: string;         // revealed after answering
  difficulty: 'easy' | 'medium' | 'hard';
  topic_tag: string;
}

interface Stats {
  accuracy_overall: number;
  streak_days: number;
  questions_answered: number;
  weak_topics: { tag: string; accuracy: number }[];
}
```

---

## Environment / Config

```typescript
// constants/config.ts
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
```

`.env.local`:
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## Build Steps (in order)

### Step 1 — Project bootstrap
- `npx create-expo-app studer-mobile --template blank-typescript`
- Install: `expo-router`, `@supabase/supabase-js`, `expo-notifications`, `nativewind`, `swr`
- Configure Expo Router in `app.json`

### Step 2 — Auth flow
- Supabase client in `services/supabase.ts`
- `useAuth` hook (session, login, register, logout)
- Login + Register screens
- Root layout auth guard (redirect to `/(auth)/login` if no session)

### Step 3 — API client + Collections screens
- `services/api.ts` typed wrapper
- Collections tab: list + create
- Collection detail: document list + upload PDF

### Step 4 — Question generation + answering
- "Generate Questions" button in Collection detail
- Today tab: fetch one question, render QuestionCard, record answer
- Show explanation after answering

### Step 5 — Push notifications
- Permission request on login
- Token registration with backend
- Deep link from notification to Today tab

### Step 6 — Progress screen
- Stats from `GET /users/me/stats`
- Streak, accuracy chart, weak topics

---

## Definition of Done (v1)

- User can register, log in, and log out
- User can create a collection, upload a PDF, and generate questions
- User can answer today's question and see the explanation
- User receives push notification with a question when scheduled by backend
- Progress screen shows accuracy and streak
- App builds with `expo build` for iOS and Android
