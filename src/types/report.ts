import { Timestamp } from 'firebase/firestore';

export type ReportReason = 
  | 'spam'
  | 'harassment'
  | 'inappropriate_content'
  | 'misinformation'
  | 'scam'
  | 'other';

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'user' | 'post' | 'comment' | 'message';
  target_id: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  created_at: Timestamp;
  reviewed_at?: Timestamp;
  reviewed_by?: string;
  resolution?: string;
}
