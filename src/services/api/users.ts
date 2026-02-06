import { getDocument, updateDocument, serverTimestamp } from '@/services/firebase/firestore';
import { getCurrentUser } from '@/services/firebase/auth';
import type { User } from '@/types';

export async function getUser(uid: string): Promise<User | null> {
  return getDocument<User>(`users/${uid}`);
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  await updateDocument(`users/${uid}`, data);
}

export async function updateLastSeen(uid: string): Promise<void> {
  await updateDocument(`users/${uid}`, {
    last_seen: serverTimestamp(),
  } as Partial<User>);
}

export async function updateNotificationToken(uid: string, token: string): Promise<void> {
  await updateDocument(`users/${uid}`, {
    notification_token: token,
  } as Partial<User>);
}

export async function getCurrentUserData(): Promise<User | null> {
  const user = getCurrentUser();
  if (!user) return null;
  return getUser(user.uid);
}
