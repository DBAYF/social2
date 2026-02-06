import { useState, useCallback } from 'react';
import { createPost, getFeedPosts } from '@/services/api/posts';
import { useToast } from './useToast';
import type { Post } from '@/types';

export function usePosts() {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const create = useCallback(async (data: {
    type: Post['type'];
    content: string;
    tags: string[];
    visibility: Post['visibility'];
  }) => {
    setIsLoading(true);
    try {
      await createPost(data);
      success('Post created successfully');
    } catch (err: any) {
      error('Failed to create post', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [success, error]);

  const fetchFeed = useCallback(async (lastPostId?: string) => {
    setIsLoading(true);
    try {
      return await getFeedPosts(lastPostId);
    } catch (err: any) {
      error('Failed to load feed', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  return {
    create,
    fetchFeed,
    isLoading,
  };
}
