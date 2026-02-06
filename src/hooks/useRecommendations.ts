import { useState, useCallback } from 'react';
import { getRecommendations, submitRecommendationFeedback } from '@/services/api/recommendations';
import { useToast } from './useToast';
import type { Recommendation } from '@/types';

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error } = useToast();

  const load = useCallback(async (type?: Recommendation['target_type']) => {
    setIsLoading(true);
    try {
      const data = await getRecommendations(type);
      setRecommendations(data);
    } catch (err: any) {
      error('Failed to load recommendations', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  const submitFeedback = useCallback(async (
    recommendationId: string,
    feedback: 'accepted' | 'dismissed'
  ) => {
    try {
      await submitRecommendationFeedback(recommendationId, feedback);
      setRecommendations((prev) =>
        prev.filter((r) => r.id !== recommendationId)
      );
    } catch (err: any) {
      error('Failed to submit feedback', err.message);
    }
  }, [error]);

  return {
    recommendations,
    isLoading,
    load,
    submitFeedback,
  };
}
