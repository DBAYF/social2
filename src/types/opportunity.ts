import { Timestamp } from 'firebase/firestore';
import type { OpportunityType, SavedStatus } from '@/utils/constants';

export interface OpportunityLocation {
  online: boolean;
  country?: string;
  city?: string;
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  source: 'manual_url' | 'api' | 'curated';
  url: string;
  organiser?: string;
  summary: string;
  location: OpportunityLocation;
  start_date?: Timestamp;
  end_date?: Timestamp;
  tags: string[];
  requirements?: Record<string, string>;
  cost?: string;
  created_at: Timestamp;
  created_by: string;
  status: 'active' | 'expired' | 'removed';
}

export interface SavedOpportunity {
  id: string;
  opportunity_id: string;
  status: SavedStatus;
  notes?: string;
  next_action_at?: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}
