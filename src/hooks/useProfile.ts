import { useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import {
  setDocument,
  updateDocument,
  getDocument,
  serverTimestamp,
} from '@/services/firebase/firestore';
import type { Profile } from '@/types';

function calculateCompleteness(data: Partial<Profile>): number {
  let score = 0;
  const weights = {
    display_name: 10,
    location: 10,
    venture_name: 15,
    venture_stage: 10,
    mission_short: 20,
    description_long: 10,
    'tags.sectors': 15,
    seeking: 10,
  };
  
  if (data.display_name) score += weights.display_name;
  if (data.location?.country) score += weights.location;
  if (data.venture_name) score += weights.venture_name;
  if (data.venture_stage) score += weights.venture_stage;
  if (data.mission_short) score += weights.mission_short;
  if (data.description_long) score += weights.description_long;
  if (data.tags?.sectors?.length) score += weights['tags.sectors'];
  if (data.seeking?.funding || data.seeking?.mentor || data.seeking?.collaborator) {
    score += weights.seeking;
  }
  
  return score;
}

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const { profile, setProfile, firebaseUser } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const createProfile = useCallback(async (data: Partial<Profile>) => {
    if (!firebaseUser) throw new Error('Not authenticated');
    
    setIsLoading(true);
    
    try {
      const profileData: Partial<Profile> = {
        ...data,
        uid: firebaseUser.uid,
        version: 1,
        updated_at: serverTimestamp() as any,
        completeness_score: calculateCompleteness(data),
      };
      
      await setDocument(`profiles/${firebaseUser.uid}`, profileData);
      
      const newProfile = await getDocument<Profile>(`profiles/${firebaseUser.uid}`);
      setProfile(newProfile);
      
      addNotification({ type: 'success', title: 'Profile created!' });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Failed to create profile',
        message: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [firebaseUser, setProfile, addNotification]);

  const updateProfile = useCallback(async (data: Partial<Profile>) => {
    if (!firebaseUser || !profile) throw new Error('Not authenticated');
    
    setIsLoading(true);
    
    try {
      const updates: Partial<Profile> = {
        ...data,
        version: profile.version + 1,
        updated_at: serverTimestamp() as any,
        completeness_score: calculateCompleteness({ ...profile, ...data }),
      };
      
      await updateDocument(`profiles/${firebaseUser.uid}`, updates);
      
      const updatedProfile = await getDocument<Profile>(`profiles/${firebaseUser.uid}`);
      setProfile(updatedProfile);
      
      addNotification({ type: 'success', title: 'Profile updated!' });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Failed to update profile',
        message: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [firebaseUser, profile, setProfile, addNotification]);

  const fetchProfile = useCallback(async (uid: string): Promise<Profile | null> => {
    return getDocument<Profile>(`profiles/${uid}`);
  }, []);

  return {
    profile,
    isLoading,
    createProfile,
    updateProfile,
    fetchProfile,
  };
}
