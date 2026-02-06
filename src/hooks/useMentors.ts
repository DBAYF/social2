import { useState, useCallback } from 'react';
import { queryDocuments } from '@/services/firebase/firestore';
import { useToast } from './useToast';
import type { Profile } from '@/types';

export function useMentors() {
  const [mentors, setMentors] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error } = useToast();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      // This would need a proper query - for now, simplified
      // In production, you'd query users with roles.mentor = true
      // and filter by profile tags/stage
      const constraints: any[] = [];
      
      // Note: This is a simplified version - you'd need proper Firestore queries
      // based on your data structure
      const data = await queryDocuments<Profile>('profiles', constraints);
      setMentors(data);
    } catch (err: any) {
      error('Failed to load mentors', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  return {
    mentors,
    isLoading,
    load,
  };
}
