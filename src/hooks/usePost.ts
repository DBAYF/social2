import { useState, useCallback, useEffect } from 'react';
import { getPost, addComment } from '@/services/api/posts';
import { subscribeToQuery, where, orderBy } from '@/services/firebase/firestore';
import { useToast } from './useToast';
import type { Post, Comment } from '@/types';

export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    if (!postId) return;

    setIsLoading(true);
    getPost(postId)
      .then(setPost)
      .catch((err) => error('Failed to load post', err.message))
      .finally(() => setIsLoading(false));

    // Subscribe to comments
    const unsubscribe = subscribeToQuery<Comment>(
      'comments',
      [
        where('post_id', '==', postId),
        orderBy('created_at', 'asc'),
      ],
      setComments
    );

    return unsubscribe;
  }, [postId, error]);

  const add = useCallback(async (content: string) => {
    try {
      await addComment(postId, content);
      success('Comment added');
    } catch (err: any) {
      error('Failed to add comment', err.message);
      throw err;
    }
  }, [postId, success, error]);

  return {
    post,
    comments,
    isLoading,
    addComment: add,
  };
}
