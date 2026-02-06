import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { getCurrentUser } from '@/services/firebase/auth';
import { subscribeToQuery } from '@/services/firebase/firestore';
import type { Thread, Message } from '@/types';

export async function createThread(otherUserId: string): Promise<string> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  // Check if thread already exists
  const existing = await findThread(otherUserId);
  if (existing) return existing.id;
  
  // Create new thread
  const memberIds: [string, string] = [user.uid, otherUserId].sort() as [string, string];
  const memberLookup: Record<string, boolean> = {
    [memberIds[0]]: true,
    [memberIds[1]]: true,
  };
  
  const threadRef = doc(collection(db, 'threads'));
  const threadData: Omit<Thread, 'id'> = {
    member_ids: memberIds,
    member_lookup: memberLookup,
    last_message_at: serverTimestamp() as any,
    last_message_preview: '',
    safety_state: 'normal',
    unread_count: {
      [user.uid]: 0,
      [otherUserId]: 0,
    },
  };
  
  await setDoc(threadRef, threadData);
  return threadRef.id;
}

export async function findThread(otherUserId: string): Promise<Thread | null> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const memberIds: [string, string] = [user.uid, otherUserId].sort() as [string, string];
  
  const q = query(
    collection(db, 'threads'),
    where('member_ids', '==', memberIds)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Thread;
}

export async function getUserThreads(): Promise<Thread[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const q = query(
    collection(db, 'threads'),
    where(`member_lookup.${user.uid}`, '==', true),
    orderBy('last_message_at', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Thread));
}

export function subscribeToUserThreads(
  callback: (threads: Thread[]) => void
): () => void {
  const user = getCurrentUser();
  if (!user) {
    callback([]);
    return () => {};
  }
  
  return subscribeToQuery<Thread>(
    'threads',
    [
      where(`member_lookup.${user.uid}`, '==', true),
      orderBy('last_message_at', 'desc'),
    ],
    callback
  );
}

export async function sendMessage(threadId: string, content: string): Promise<string> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const messageRef = doc(collection(db, 'messages'));
  const messageData: Omit<Message, 'id'> = {
    thread_id: threadId,
    sender_id: user.uid,
    content,
    created_at: serverTimestamp() as any,
    read_at: {},
  };
  
  await setDoc(messageRef, messageData);
  
  // Update thread
  const threadRef = doc(db, 'threads', threadId);
  const thread = await getDoc(threadRef);
  if (thread.exists()) {
    const threadData = thread.data() as Thread;
    const otherUserId = threadData.member_ids.find(id => id !== user.uid) || user.uid;
    
    await updateDoc(threadRef, {
      last_message_at: serverTimestamp(),
      last_message_preview: content.slice(0, 100),
      [`unread_count.${otherUserId}`]: (threadData.unread_count[otherUserId] || 0) + 1,
    });
  }
  
  return messageRef.id;
}

export async function getThreadMessages(threadId: string): Promise<Message[]> {
  const q = query(
    collection(db, 'messages'),
    where('thread_id', '==', threadId),
    orderBy('created_at', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
}

export function subscribeToThreadMessages(
  threadId: string,
  callback: (messages: Message[]) => void
): () => void {
  return subscribeToQuery<Message>(
    'messages',
    [
      where('thread_id', '==', threadId),
      orderBy('created_at', 'asc'),
    ],
    callback
  );
}

export async function markMessageRead(threadId: string, messageId: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const messageRef = doc(db, 'messages', messageId);
  await updateDoc(messageRef, {
    [`read_at.${user.uid}`]: serverTimestamp(),
  });
  
  // Reset unread count
  const threadRef = doc(db, 'threads', threadId);
  await updateDoc(threadRef, {
    [`unread_count.${user.uid}`]: 0,
  });
}
