import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { getCurrentUser } from '@/services/firebase/auth';
import { getProfile } from './profiles';
import type { Post, Comment, ProfileSnapshot } from '@/types';

export async function createPost(data: {
  type: Post['type'];
  content: string;
  tags: string[];
  visibility: Post['visibility'];
}): Promise<string> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const profile = await getProfile(user.uid);
  if (!profile) throw new Error('Profile not found');
  
  const authorSnapshot: ProfileSnapshot = {
    uid: profile.uid,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url,
    venture_name: profile.venture_name,
    venture_stage: profile.venture_stage,
  };
  
  const postRef = doc(collection(db, 'posts'));
  const postData: Omit<Post, 'id'> = {
    author_id: user.uid,
    author_snapshot: authorSnapshot,
    type: data.type,
    content: data.content,
    tags: data.tags,
    visibility: data.visibility,
    created_at: serverTimestamp() as any,
    moderation_state: 'ok',
    engagement: {
      saves_count: 0,
      replies_count: 0,
    },
  };
  
  await setDoc(postRef, postData);
  return postRef.id;
}

export async function getPost(postId: string): Promise<Post | null> {
  const docRef = doc(db, 'posts', postId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return { id: docSnap.id, ...docSnap.data() } as Post;
}

export async function getFeedPosts(
  lastPostId?: string,
  pageSize = 20
): Promise<Post[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  let q = query(
    collection(db, 'posts'),
    where('visibility', 'in', ['public', 'members']),
    orderBy('created_at', 'desc'),
    limit(pageSize)
  );
  
  if (lastPostId) {
    const lastDoc = await getDoc(doc(db, 'posts', lastPostId));
    if (lastDoc.exists()) {
      q = query(
        collection(db, 'posts'),
        where('visibility', 'in', ['public', 'members']),
        orderBy('created_at', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
}

export async function addComment(postId: string, content: string): Promise<string> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const profile = await getProfile(user.uid);
  if (!profile) throw new Error('Profile not found');
  
  const authorSnapshot: ProfileSnapshot = {
    uid: profile.uid,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url,
    venture_name: profile.venture_name,
    venture_stage: profile.venture_stage,
  };
  
  const commentRef = doc(collection(db, 'comments'));
  const commentData: Omit<Comment, 'id'> = {
    post_id: postId,
    author_id: user.uid,
    author_snapshot: authorSnapshot,
    content,
    created_at: serverTimestamp() as any,
    moderation_state: 'ok',
  };
  
  await setDoc(commentRef, commentData);
  
  // Increment reply count
  await updateDoc(doc(db, 'posts', postId), {
    'engagement.replies_count': increment(1),
  });
  
  return commentRef.id;
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  const q = query(
    collection(db, 'comments'),
    where('post_id', '==', postId),
    orderBy('created_at', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
}
