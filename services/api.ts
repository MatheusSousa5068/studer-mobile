import { API_BASE_URL } from '@/constants/config';
import { supabase } from './supabase';
import type {
  Collection,
  Document,
  Question,
  AnswerResponse,
  StatsResponse,
} from '@/types';

async function authHeader(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
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
    headers: await authHeader(),
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
      postForm<{ document_id: string; summary: string[] }>(
        `/collections/${id}/documents`,
        file
      ),
    generateQuestions: (id: string, count = 5) =>
      post<{ questions_generated: number; questions: Question[] }>(
        `/collections/${id}/generate?count=${count}`,
        {}
      ),
    questions: (id: string) =>
      get<Question[]>(`/collections/${id}/questions`),
    documents: (id: string) =>
      get<Document[]>(`/collections/${id}/documents`),
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
