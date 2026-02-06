import { Timestamp } from 'firebase/firestore';

export type RecommendationType = 'person' | 'mentor' | 'opportunity';

export interface Recommendation {
  id: string;
  target_type: RecommendationType;
  target_id: string;
  score: number;
  explanation: string;
  factors: string[];
  created_at: Timestamp;
  profile_version: number;
  feedback?: 'accepted' | 'dismissed';
}
