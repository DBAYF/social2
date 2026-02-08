import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, updateDoc, query, where, orderBy, limit } from 'firebase-admin/firestore';

interface Recommendation {
  id: string;
  userId: string;
  targetType: 'person' | 'mentor' | 'opportunity';
  targetId: string;
  score: number;
  explanation: string;
  factors: string[];
  createdAt: Date;
  profileVersion: number;
  feedback?: 'accepted' | 'dismissed';
}

export class RecommendationsService {
  static async getRecommendationsForUser(userId: string, targetType?: Recommendation['targetType'], limitCount = 10) {
    try {
      let q = query(
        collection(db, 'recommendations'),
        where('userId', '==', userId),
        orderBy('score', 'desc'),
        limit(limitCount)
      );

      if (targetType) {
        q = query(q, where('targetType', '==', targetType));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recommendation));
    } catch (error) {
      throw new Error('Failed to fetch recommendations');
    }
  }

  static async createRecommendation(data: Omit<Recommendation, 'id' | 'createdAt'>) {
    try {
      const recommendationRef = doc(collection(db, 'recommendations'));
      const recommendationData: Omit<Recommendation, 'id'> = {
        ...data,
        createdAt: new Date(),
      };

      await setDoc(recommendationRef, recommendationData);
      return { id: recommendationRef.id, ...recommendationData };
    } catch (error) {
      throw new Error('Failed to create recommendation');
    }
  }

  static async submitFeedback(recommendationId: string, feedback: 'accepted' | 'dismissed') {
    try {
      await updateDoc(doc(db, 'recommendations', recommendationId), {
        feedback,
      });
    } catch (error) {
      throw new Error('Failed to submit feedback');
    }
  }

  // Generate recommendations based on user profile and activity
  static async generateRecommendations(userId: string) {
    try {
      // This would be a complex algorithm based on:
      // - User profile (venture stage, tags, seeking)
      // - Similar users
      // - Recent activity
      // - Network connections

      // For now, return empty array - this would be implemented with ML/AI
      return [];
    } catch (error) {
      throw new Error('Failed to generate recommendations');
    }
  }
}