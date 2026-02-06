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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { getCurrentUser } from '@/services/firebase/auth';
import type { Opportunity, SavedOpportunity } from '@/types';
import type { OpportunityType } from '@/utils/constants';

export async function getOpportunities(
  filters?: {
    type?: OpportunityType;
    tags?: string[];
    status?: 'active' | 'expired' | 'removed';
  },
  lastId?: string,
  pageSize = 20
): Promise<Opportunity[]> {
  let constraints: any[] = [];
  
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  } else {
    constraints.push(where('status', '==', 'active'));
  }
  
  if (filters?.type) {
    constraints.push(where('type', '==', filters.type));
  }
  
  constraints.push(orderBy('created_at', 'desc'));
  constraints.push(limit(pageSize));
  
  if (lastId) {
    const lastDoc = await getDoc(doc(db, 'opportunities', lastId));
    if (lastDoc.exists()) {
      constraints.push(startAfter(lastDoc));
    }
  }
  
  const q = query(collection(db, 'opportunities'), ...constraints);
  const snapshot = await getDocs(q);
  
  let opportunities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Opportunity));
  
  // Filter by tags if provided
  if (filters?.tags && filters.tags.length > 0) {
    opportunities = opportunities.filter(opp =>
      filters.tags!.some(tag => opp.tags.includes(tag))
    );
  }
  
  return opportunities;
}

export async function getOpportunity(opportunityId: string): Promise<Opportunity | null> {
  const docRef = doc(db, 'opportunities', opportunityId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return { id: docSnap.id, ...docSnap.data() } as Opportunity;
}

export async function saveOpportunity(
  opportunityId: string,
  status: SavedOpportunity['status'] = 'saved',
  notes?: string
): Promise<string> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  // Check if already saved
  const existing = await findSavedOpportunity(opportunityId);
  if (existing) {
    await updateDoc(doc(db, 'saved_opportunities', existing.id), {
      status,
      notes,
      updated_at: serverTimestamp(),
    });
    return existing.id;
  }
  
  const savedRef = doc(collection(db, 'saved_opportunities'));
  await setDoc(savedRef, {
    opportunity_id: opportunityId,
    status,
    notes,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  
  return savedRef.id;
}

export async function findSavedOpportunity(opportunityId: string): Promise<SavedOpportunity | null> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const q = query(
    collection(db, 'saved_opportunities'),
    where('opportunity_id', '==', opportunityId)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as SavedOpportunity;
}

export async function getSavedOpportunities(
  status?: SavedOpportunity['status']
): Promise<SavedOpportunity[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  let q = query(
    collection(db, 'saved_opportunities'),
    orderBy('updated_at', 'desc')
  );
  
  if (status) {
    q = query(
      collection(db, 'saved_opportunities'),
      where('status', '==', status),
      orderBy('updated_at', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedOpportunity));
}

export async function updateSavedOpportunityStatus(
  savedId: string,
  status: SavedOpportunity['status']
): Promise<void> {
  await updateDoc(doc(db, 'saved_opportunities', savedId), {
    status,
    updated_at: serverTimestamp(),
  });
}
