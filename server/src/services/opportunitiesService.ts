import { db } from '../config/firebase';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter } from 'firebase-admin/firestore';

interface Opportunity {
  id: string;
  title: string;
  type: 'event' | 'grant' | 'programme' | 'accelerator' | 'community';
  summary: string;
  description?: string;
  url?: string;
  organiser?: string;
  location: {
    online: boolean;
    country?: string;
    city?: string;
  };
  startDate?: Date;
  endDate?: Date;
  tags: string[];
  requirements?: Record<string, string>;
  cost?: string;
  createdAt: Date;
  updatedAt?: Date;
  status: 'active' | 'expired' | 'removed';
}

interface SavedOpportunity {
  id: string;
  userId: string;
  opportunityId: string;
  status: 'saved' | 'interested' | 'applied' | 'attended' | 'done' | 'ignored';
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class OpportunitiesService {
  static async createOpportunity(data: Omit<Opportunity, 'id' | 'createdAt'>) {
    try {
      const opportunityRef = doc(collection(db, 'opportunities'));
      const opportunityData: Omit<Opportunity, 'id'> = {
        ...data,
        createdAt: new Date(),
      };

      await setDoc(opportunityRef, opportunityData);
      return { id: opportunityRef.id, ...opportunityData };
    } catch (error) {
      throw new Error('Failed to create opportunity');
    }
  }

  static async getOpportunities(limitCount = 20, lastId?: string) {
    try {
      let q = query(
        collection(db, 'opportunities'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastId) {
        const lastDoc = await getDoc(doc(db, 'opportunities', lastId));
        if (lastDoc.exists) {
          q = query(q, startAfter(lastDoc));
        }
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Opportunity));
    } catch (error) {
      throw new Error('Failed to fetch opportunities');
    }
  }

  static async getOpportunityById(opportunityId: string): Promise<Opportunity | null> {
    try {
      const opportunityDoc = await getDoc(doc(db, 'opportunities', opportunityId));
      if (!opportunityDoc.exists()) return null;

      return { id: opportunityDoc.id, ...opportunityDoc.data() } as Opportunity;
    } catch (error) {
      return null;
    }
  }

  static async saveOpportunity(userId: string, opportunityId: string, status: SavedOpportunity['status'] = 'saved', notes?: string) {
    try {
      // Check if already saved
      const existing = await this.findSavedOpportunity(userId, opportunityId);
      if (existing) {
        await updateDoc(doc(db, 'saved_opportunities', existing.id), {
          status,
          notes,
          updatedAt: new Date(),
        });
        return existing.id;
      }

      const savedRef = doc(collection(db, 'saved_opportunities'));
      const savedData: Omit<SavedOpportunity, 'id'> = {
        userId,
        opportunityId,
        status,
        notes,
        createdAt: new Date(),
      };

      await setDoc(savedRef, savedData);
      return savedRef.id;
    } catch (error) {
      throw new Error('Failed to save opportunity');
    }
  }

  static async findSavedOpportunity(userId: string, opportunityId: string): Promise<SavedOpportunity | null> {
    try {
      const q = query(
        collection(db, 'saved_opportunities'),
        where('userId', '==', userId),
        where('opportunityId', '==', opportunityId)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as SavedOpportunity;
    } catch (error) {
      return null;
    }
  }

  static async getSavedOpportunities(userId: string) {
    try {
      const q = query(
        collection(db, 'saved_opportunities'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedOpportunity));
    } catch (error) {
      throw new Error('Failed to fetch saved opportunities');
    }
  }

  static async updateSavedOpportunityStatus(savedId: string, status: SavedOpportunity['status']) {
    try {
      await updateDoc(doc(db, 'saved_opportunities', savedId), {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error('Failed to update status');
    }
  }
}