import { Timestamp } from 'firebase/firestore';
import type { PrivacyLevel } from '@/utils/constants';
import type { VentureStage } from '@/utils/constants';

export interface ProfileLocation {
  country: string;
  region?: string;
  city?: string;
  geohash?: string;
}

export interface ProfileTags {
  sectors: string[];
  audiences?: string[];
}

export interface ProfileSeeking {
  funding: boolean;
  mentor: boolean;
  collaborator: boolean;
}

export interface ProfileConstraints {
  online_only?: boolean;
  free_only?: boolean;
  distance_km?: number;
  exclusions?: string[];
}

export interface Profile {
  uid: string;
  display_name: string;
  avatar_url?: string;
  location: ProfileLocation;
  venture_name: string;
  venture_stage: VentureStage;
  mission_short: string;
  description_long?: string;
  tags: ProfileTags;
  seeking: ProfileSeeking;
  funding_needed_range?: string;
  constraints?: ProfileConstraints;
  privacy: PrivacyLevel;
  version: number;
  updated_at: Timestamp;
  completeness_score: number;
}

export interface ProfileSnapshot {
  uid: string;
  display_name: string;
  avatar_url?: string;
  venture_name: string;
  venture_stage: VentureStage;
}
