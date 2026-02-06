import { useState, useCallback } from 'react';
import {
  getOpportunities,
  saveOpportunity,
  getSavedOpportunities,
  updateSavedOpportunityStatus,
} from '@/services/api/opportunities';
import { useToast } from './useToast';
import type { Opportunity, SavedOpportunity } from '@/types';
import type { OpportunityType } from '@/utils/constants';

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [saved, setSaved] = useState<SavedOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const load = useCallback(async (
    filters?: { type?: OpportunityType; tags?: string[] },
    lastId?: string
  ) => {
    setIsLoading(true);
    try {
      const data = await getOpportunities(filters, lastId);
      setOpportunities(data);
      return data;
    } catch (err: any) {
      error('Failed to load opportunities', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  const loadSaved = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSavedOpportunities();
      setSaved(data);
    } catch (err: any) {
      error('Failed to load saved opportunities', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  const save = useCallback(async (
    opportunityId: string,
    status: SavedOpportunity['status'] = 'saved',
    notes?: string
  ) => {
    try {
      await saveOpportunity(opportunityId, status, notes);
      success('Opportunity saved');
      await loadSaved();
    } catch (err: any) {
      error('Failed to save opportunity', err.message);
      throw err;
    }
  }, [success, error, loadSaved]);

  const updateStatus = useCallback(async (
    savedId: string,
    status: SavedOpportunity['status']
  ) => {
    try {
      await updateSavedOpportunityStatus(savedId, status);
      await loadSaved();
    } catch (err: any) {
      error('Failed to update status', err.message);
      throw err;
    }
  }, [error, loadSaved]);

  return {
    opportunities,
    saved,
    isLoading,
    load,
    loadSaved,
    save,
    updateStatus,
  };
}
