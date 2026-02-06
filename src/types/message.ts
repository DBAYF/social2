import { Timestamp } from 'firebase/firestore';

export interface Thread {
  id: string;
  member_ids: [string, string];
  member_lookup: Record<string, boolean>;
  last_message_at: Timestamp;
  last_message_preview: string;
  safety_state: 'normal' | 'flagged' | 'restricted';
  unread_count: Record<string, number>;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: Timestamp;
  read_at?: Record<string, Timestamp>;
  metadata?: {
    draft_used?: boolean;
  };
}
