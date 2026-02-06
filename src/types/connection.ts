import { Timestamp } from 'firebase/firestore';
import type { ConnectionStatus } from '@/utils/constants';

export interface Connection {
  id: string;
  user_a: string;
  user_b: string;
  status: ConnectionStatus;
  requested_by: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  block_reason?: string;
}
