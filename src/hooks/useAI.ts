import { useState, useCallback } from 'react';
import { aiClient } from '@/services/ai/client';
import { useToast } from './useToast';
import type { AIUseCase, AIContext } from '@/services/ai/types';

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const { error: showError } = useToast();

  const call = useCallback(async (
    useCase: AIUseCase,
    input: string,
    context?: AIContext
  ) => {
    setIsLoading(true);
    setError(null);
    setRequestId(null);

    try {
      const response = await aiClient.call(useCase, input, context);
      setRequestId(response.meta.requestId);
      return response.text;
    } catch (err: any) {
      setError(err);
      showError('AI request failed', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const generateDraft = useCallback((input: string, context?: AIContext) => {
    return call('draft_outreach', input, context);
  }, [call]);

  const summariseVenture = useCallback((input: string, context?: AIContext) => {
    return call('summarise_venture', input, context);
  }, [call]);

  const suggestTags = useCallback((input: string, context?: AIContext) => {
    return call('suggest_tags', input, context);
  }, [call]);

  const explainRelevance = useCallback((input: string, context?: AIContext) => {
    return call('explain_relevance', input, context);
  }, [call]);

  const opportunitySummary = useCallback((input: string, context?: AIContext) => {
    return call('opportunity_summary', input, context);
  }, [call]);

  return {
    isLoading,
    error,
    requestId,
    call,
    generateDraft,
    summariseVenture,
    suggestTags,
    explainRelevance,
    opportunitySummary,
  };
}
