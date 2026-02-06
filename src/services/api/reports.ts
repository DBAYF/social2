import {
  collection,
  doc,
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
import type { Report, ReportReason, ReportStatus } from '@/types';

export async function createReport(data: {
  target_type: Report['target_type'];
  target_id: string;
  reason: ReportReason;
  description?: string;
}): Promise<string> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const reportRef = doc(collection(db, 'reports'));
  const reportData: Omit<Report, 'id'> = {
    reporter_id: user.uid,
    target_type: data.target_type,
    target_id: data.target_id,
    reason: data.reason,
    description: data.description,
    status: 'pending',
    created_at: serverTimestamp() as any,
  };
  
  await setDoc(reportRef, reportData);
  return reportRef.id;
}

export async function getReports(status?: ReportStatus): Promise<Report[]> {
  let q = query(
    collection(db, 'reports'),
    orderBy('created_at', 'desc')
  );
  
  if (status) {
    q = query(
      collection(db, 'reports'),
      where('status', '==', status),
      orderBy('created_at', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  reviewedBy: string,
  resolution?: string
): Promise<void> {
  await updateDoc(doc(db, 'reports', reportId), {
    status,
    reviewed_by: reviewedBy,
    reviewed_at: serverTimestamp(),
    resolution,
  });
}
