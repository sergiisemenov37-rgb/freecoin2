export interface Notification {
  id: string;
  user_id: string;
  type: 'friend_request' | 'guild_invite' | 'tournament_start' | 'achievement' | 'reward' | 'message' | 'war_started' | 'quest_completed' | 'guild_announcement';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}

export interface PushSubscription {
  user_id: string;
  endpoint: string;
  auth: string;
  p256dh: string;
  created_at: string;
}

export interface NotificationPreference {
  user_id: string;
  friend_requests: boolean;
  guild_events: boolean;
  tournament_updates: boolean;
  achievements: boolean;
  messages: boolean;
  promotions: boolean;
  created_at: string;
}
