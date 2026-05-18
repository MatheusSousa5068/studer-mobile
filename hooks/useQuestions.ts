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

export function useTodayQuestions() {
  const { data, error, isLoading, mutate } = useSWR<Question[]>(
    'today-questions',
    async () => {
      const collections = await api.collections.list();
      const all: Question[] = [];
      for (const c of collections) {
        const questions = await api.collections.questions(c.id);
        all.push(...questions);
      }
      return all;
    }
  );

  return {
    questions: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
