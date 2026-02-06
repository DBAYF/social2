import {
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  or,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { getCurrentUser } from '@/services/firebase/auth';
import type { Connection } from '@/types';

export async function requestConnection(otherUserId: string): Promise<string> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  // Check if connection already exists
  const existing = await findConnection(otherUserId);
  if (existing) {
    if (existing.status === 'blocked') {
      throw new Error('Connection is blocked');
    }
    return existing.id;
  }
  
  // Create connection request
  const connectionRef = doc(collection(db, 'connections'));
  const connectionData: Omit<Connection, 'id'> = {
    user_a: user.uid < otherUserId ? user.uid : otherUserId,
    user_b: user.uid < otherUserId ? otherUserId : user.uid,
    status: 'requested',
    requested_by: user.uid,
    created_at: serverTimestamp() as any,
    updated_at: serverTimestamp() as any,
  };
  
  await setDoc(connectionRef, connectionData);
  return connectionRef.id;
}

export async function findConnection(otherUserId: string): Promise<Connection | null> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const userA = user.uid < otherUserId ? user.uid : otherUserId;
  const userB = user.uid < otherUserId ? otherUserId : user.uid;
  
  const q = query(
    collection(db, 'connections'),
    where('user_a', '==', userA),
    where('user_b', '==', userB)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Connection;
}

export async function acceptConnection(connectionId: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  await updateDoc(doc(db, 'connections', connectionId), {
    status: 'accepted',
    updated_at: serverTimestamp(),
  });
}

export async function declineConnection(connectionId: string): Promise<void> {
  await updateDoc(doc(db, 'connections', connectionId), {
    status: 'blocked',
    updated_at: serverTimestamp(),
  });
}

export async function blockConnection(otherUserId: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const existing = await findConnection(otherUserId);
  if (existing) {
    await updateDoc(doc(db, 'connections', existing.id), {
      status: 'blocked',
      block_reason: 'User blocked',
      updated_at: serverTimestamp(),
    });
  } else {
    const connectionRef = doc(collection(db, 'connections'));
    const userA = user.uid < otherUserId ? user.uid : otherUserId;
    const userB = user.uid < otherUserId ? otherUserId : user.uid;
    
    await setDoc(connectionRef, {
      user_a: userA,
      user_b: userB,
      status: 'blocked',
      requested_by: user.uid,
      block_reason: 'User blocked',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
  }
}

export async function getUserConnections(): Promise<Connection[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const q = query(
    collection(db, 'connections'),
    or(
      where('user_a', '==', user.uid),
      where('user_b', '==', user.uid)
    )
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Connection))
    .filter(conn => conn.status === 'accepted');
}

export async function getPendingConnections(): Promise<Connection[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const q = query(
    collection(db, 'connections'),
    where('user_b', '==', user.uid),
    where('status', '==', 'requested')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Connection));
}
