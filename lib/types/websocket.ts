export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export interface UserPresence {
  user_id: string;
  guild_id?: number;
  status: 'online' | 'offline' | 'away';
  last_seen: string;
}

export interface GuildChatMessage {
  id: number;
  guild_id: number;
  user_id: string;
  content: string;
  created_at: string;
}

export interface RealtimeUpdate {
  type: 'guild_member_joined' | 'user_status_changed' | 'message_sent' | 'quest_completed' | 'war_started';
  data: any;
  timestamp: string;
}
