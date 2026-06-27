export interface Notification {
  id: string;
  telegram_id: string;
  type: 'achievement' | 'reward' | 'guild' | 'event' | 'lottery' | 'referral' | 'system';
  title: string;
  message: string;
  icon: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

export function createNotification(
  telegramId: string,
  type: Notification['type'],
  title: string,
  message: string,
  icon: string,
  actionUrl?: string
): Notification {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    telegram_id: telegramId,
    type,
    title,
    message,
    icon,
    read: false,
    created_at: new Date().toISOString(),
    action_url: actionUrl
  };
}

export function getNotificationIcon(type: Notification['type']): string {
  const icons = {
    achievement: '🏆',
    reward: '💰',
    guild: '🏰',
    event: '🎉',
    lottery: '🎰',
    referral: '👥',
    system: '📢'
  };
  return icons[type];
}

export function formatNotificationTime(date: string): string {
  const now = new Date();
  const notificationDate = new Date(date);
  const diff = now.getTime() - notificationDate.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
