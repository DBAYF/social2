import { Timestamp } from 'firebase/firestore';

export interface UserRoles {
  founder: boolean;
  mentor: boolean;
  admin: boolean;
  moderator: boolean;
}

export interface UserSafety {
  reports_count: number;
  strikes: number;
  risk_level: 'low' | 'medium' | 'high';
}

export interface NotificationPrefs {
  push_enabled: boolean;
  email_digest: boolean;
  messages: boolean;
  connections: boolean;
  recommendations: boolean;
  reminders: boolean;
}

export interface User {
  uid: string;
  email?: string;
  auth_providers: ('email' | 'google' | 'apple')[];
  roles: UserRoles;
  status: 'active' | 'suspended' | 'deleted';
  created_at: Timestamp;
  last_seen: Timestamp;
  safety: UserSafety;
  notification_token?: string;
  notification_prefs: NotificationPrefs;
}
