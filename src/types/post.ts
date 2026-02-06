import { Timestamp } from 'firebase/firestore';
import type { PostType, PrivacyLevel } from '@/utils/constants';
import type { ProfileSnapshot } from './profile';

export interface PostEngagement {
  saves_count: number;
  replies_count: number;
}

export interface Post {
  id: string;
  author_id: string;
  author_snapshot: ProfileSnapshot;
  type: PostType;
  content: string;
  tags: string[];
  visibility: PrivacyLevel;
  created_at: Timestamp;
  moderation_state: 'ok' | 'flagged' | 'removed';
  engagement: PostEngagement;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_snapshot: ProfileSnapshot;
  content: string;
  created_at: Timestamp;
  moderation_state: 'ok' | 'flagged' | 'removed';
}
