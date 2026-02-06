import { useState, useCallback } from 'react';

export interface UseInfiniteQueryOptions<T> {
  fetchFn: (lastId?: string) => Promise<T[]>;
  getId: (item: T) => string;
  pageSize?: number;
}

export function useInfiniteQuery<T>({
  fetchFn,
  getId,
  pageSize = 20,
}: UseInfiniteQueryOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const lastId = data.length > 0 ? getId(data[data.length - 1]) : undefined;
      const newItems = await fetchFn(lastId);

      if (newItems.length < pageSize) {
        setHasMore(false);
      }

      setData((prev) => [...prev, ...newItems]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load'));
    } finally {
      setIsLoading(false);
    }
  }, [data, fetchFn, getId, isLoading, hasMore, pageSize]);

  const reset = useCallback(() => {
    setData([]);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    hasMore,
    error,
    loadMore,
    reset,
  };
}
