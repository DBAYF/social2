import { useState, useCallback } from 'react';
import { createThread, getUserThreads, subscribeToUserThreads } from '@/services/api/messages';
import { useToast } from './useToast';
import type { Thread } from '@/types';

export function useMessages() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const loadThreads = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUserThreads();
      setThreads(data);
    } catch (err: any) {
      error('Failed to load messages', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  const create = useCallback(async (otherUserId: string) => {
    try {
      const threadId = await createThread(otherUserId);
      success('Thread created');
      return threadId;
    } catch (err: any) {
      error('Failed to create thread', err.message);
      throw err;
    }
  }, [success, error]);

  const subscribe = useCallback((callback: (threads: Thread[]) => void) => {
    return subscribeToUserThreads(callback);
  }, []);

  return {
    threads,
    isLoading,
    loadThreads,
    createThread: create,
    subscribe,
  };
}
