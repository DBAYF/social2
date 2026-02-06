import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';

// Generic typed helpers
export async function getDocument<T>(path: string): Promise<T | null> {
  const docRef = doc(db, path);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return { id: docSnap.id, ...docSnap.data() } as T;
}

export async function setDocument<T extends Record<string, any>>(
  path: string,
  data: T,
  merge = false
): Promise<void> {
  const docRef = doc(db, path);
  await setDoc(docRef, data as any, { merge });
}

export async function updateDocument<T extends Record<string, any>>(
  path: string,
  data: Partial<T>
): Promise<void> {
  const docRef = doc(db, path);
  await updateDoc(docRef, data as any);
}

export async function deleteDocument(path: string): Promise<void> {
  const docRef = doc(db, path);
  await deleteDoc(docRef);
}

export async function queryDocuments<T>(
  collectionPath: string,
  constraints: QueryConstraint[]
): Promise<T[]> {
  const q = query(collection(db, collectionPath), ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

export function subscribeToDocument<T>(
  path: string,
  callback: (data: T | null) => void
): () => void {
  const docRef = doc(db, path);
  
  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback({ id: snapshot.id, ...snapshot.data() } as T);
  });
}

export function subscribeToQuery<T>(
  collectionPath: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
): () => void {
  const q = query(collection(db, collectionPath), ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    callback(data);
  });
}

// Re-export commonly used functions
export {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
};
