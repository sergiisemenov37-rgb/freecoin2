export interface Friend {
  telegram_id: string;
  username: string;
  first_name: string;
  status: 'online' | 'offline' | 'mining';
  last_seen: string;
  added_at: string;
}

export interface FriendRequest {
  id: string;
  from_telegram_id: string;
  to_telegram_id: string;
  from_username: string;
  from_first_name: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Message {
  id: string;
  from_telegram_id: string;
  to_telegram_id: string;
  content: string;
  type: 'text' | 'system';
  read: boolean;
  created_at: string;
}

export interface GuildMessage {
  id: string;
  guild_id: string;
  from_telegram_id: string;
  from_username: string;
  content: string;
  type: 'text' | 'system' | 'announcement';
  created_at: string;
}

export function canSendFriendRequest(lastRequestTime: string | null): boolean {
  if (!lastRequestTime) return true;
  
  const lastTime = new Date(lastRequestTime);
  const now = new Date();
  const diffHours = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);
  
  return diffHours >= 1; // 1 hour cooldown
}

export function formatLastSeen(lastSeen: string): string {
  const now = new Date();
  const lastSeenDate = new Date(lastSeen);
  const diff = now.getTime() - lastSeenDate.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return lastSeenDate.toLocaleDateString();
}

export function getOnlineStatus(lastSeen: string): 'online' | 'offline' | 'mining' {
  const now = new Date();
  const lastSeenDate = new Date(lastSeen);
  const diffMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);
  
  if (diffMinutes < 5) return 'online';
  if (diffMinutes < 30) return 'mining';
  return 'offline';
}

export const MAX_FRIENDS = 100;
export const MAX_MESSAGES = 50;
