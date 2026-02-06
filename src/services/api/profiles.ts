import { getDocument, setDocument, updateDocument, serverTimestamp } from '@/services/firebase/firestore';
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

export async function getProfile(uid: string): Promise<Profile | null> {
  return getDocument<Profile>(`profiles/${uid}`);
}

export async function createProfile(uid: string, data: Partial<Profile>): Promise<void> {
  const profileData: Partial<Profile> = {
    ...data,
    uid,
    version: 1,
    updated_at: serverTimestamp() as any,
    completeness_score: calculateCompleteness(data),
  };
  
  await setDocument(`profiles/${uid}`, profileData);
}

export async function updateProfile(uid: string, data: Partial<Profile>, currentVersion: number): Promise<void> {
  const updates: Partial<Profile> = {
    ...data,
    version: currentVersion + 1,
    updated_at: serverTimestamp() as any,
  };
  
  // Recalculate completeness if relevant fields changed
  const existing = await getProfile(uid);
  if (existing) {
    updates.completeness_score = calculateCompleteness({ ...existing, ...data });
  }
  
  await updateDocument(`profiles/${uid}`, updates);
}
