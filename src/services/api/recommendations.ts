import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { getCurrentUser } from '@/services/firebase/auth';
import type { Recommendation } from '@/types';

export async function getRecommendations(
  type?: Recommendation['target_type'],
  limitCount = 10
): Promise<Recommendation[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  let q = query(
    collection(db, 'recommendations'),
    where('user_id', '==', user.uid),
    orderBy('score', 'desc'),
    limit(limitCount)
  );
  
  if (type) {
    q = query(
      collection(db, 'recommendations'),
      where('user_id', '==', user.uid),
      where('target_type', '==', type),
      orderBy('score', 'desc'),
      limit(limitCount)
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recommendation));
}

export async function submitRecommendationFeedback(
  recommendationId: string,
  feedback: 'accepted' | 'dismissed'
): Promise<void> {
  const { updateDocument } = await import('@/services/firebase/firestore');
  await updateDocument(`recommendations/${recommendationId}`, {
    feedback,
  });
}
