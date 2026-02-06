import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { User } from '@/types';

export async function signIn(email: string, password: string): Promise<FirebaseUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signUp(email: string, password: string): Promise<FirebaseUser> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user document
  const userData: Partial<User> = {
    uid: result.user.uid,
    email: result.user.email || undefined,
    auth_providers: ['email'],
    roles: { founder: true, mentor: false, admin: false, moderator: false },
    status: 'active',
    created_at: serverTimestamp() as any,
    last_seen: serverTimestamp() as any,
    safety: { reports_count: 0, strikes: 0, risk_level: 'low' },
    notification_prefs: {
      push_enabled: true,
      email_digest: false,
      messages: true,
      connections: true,
      recommendations: true,
      reminders: true,
    },
  };
  
  await setDoc(doc(db, 'users', result.user.uid), userData);
  
  // Send verification email
  await sendEmailVerification(result.user);
  
  return result.user;
}

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  // Check if user doc exists, create if not
  const userRef = doc(db, 'users', result.user.uid);
  
  const userData: Partial<User> = {
    uid: result.user.uid,
    email: result.user.email || undefined,
    auth_providers: ['google'],
    roles: { founder: true, mentor: false, admin: false, moderator: false },
    status: 'active',
    created_at: serverTimestamp() as any,
    last_seen: serverTimestamp() as any,
    safety: { reports_count: 0, strikes: 0, risk_level: 'low' },
    notification_prefs: {
      push_enabled: true,
      email_digest: false,
      messages: true,
      connections: true,
      recommendations: true,
      reminders: true,
    },
  };
  
  await setDoc(userRef, userData, { merge: true });
  
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}
