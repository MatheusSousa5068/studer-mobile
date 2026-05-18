import useSWR from 'swr';
import { api } from '@/services/api';
import type { Question } from '@/types';

export function useQuestions(collectionId: string) {
  const { data, error, isLoading, mutate } = useSWR<Question[]>(
    collectionId ? `questions/${collectionId}` : null,
    () => api.collections.questions(collectionId)
  );

  return {
    questions: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

export function useTodayQuestion() {
  const { data, error, isLoading, mutate } = useSWR<Question | null>(
    'today-question',
    async () => {
      const collections = await api.collections.list();
      for (const c of collections) {
        const questions = await api.collections.questions(c.id);
        if (questions.length > 0) return questions[0];
      }
      return null;
    }
  );

  return {
    question: data ?? null,
    isLoading,
    error,
    mutate,
  };
}
