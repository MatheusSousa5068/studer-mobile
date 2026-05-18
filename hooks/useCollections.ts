import useSWR from 'swr';
import { api } from '@/services/api';
import type { Collection } from '@/types';

export function useCollections() {
  const { data, error, isLoading, mutate } = useSWR<Collection[]>(
    'collections',
    () => api.collections.list()
  );

  return {
    collections: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
