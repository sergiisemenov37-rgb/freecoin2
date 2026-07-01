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

export interface PushNotification {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
  disable_notification?: boolean;
}

export async function sendTelegramPushNotification(
  chatId: string,
  message: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN not set');
      return false;
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: parseMode,
        disable_notification: false
      })
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

export async function sendAchievementNotification(
  chatId: string,
  achievementName: string,
  reward: number
): Promise<boolean> {
  const message = `🏆 <b>Achievement Unlocked!</b>\n\nYou earned the <b>${achievementName}</b> achievement!\n\n💰 Reward: ${reward} FREE`;
  return sendTelegramPushNotification(chatId, message);
}

export async function sendRewardNotification(
  chatId: string,
  rewardType: string,
  amount: number
): Promise<boolean> {
  const message = `💰 <b>Reward Received!</b>\n\nYou received <b>${amount} FREE</b> from ${rewardType}!\n\nKeep up the good work!`;
  return sendTelegramPushNotification(chatId, message);
}

export async function sendGuildNotification(
  chatId: string,
  guildName: string,
  action: string
): Promise<boolean> {
  const message = `🏰 <b>Guild Update</b>\n\n${action}\n\nGuild: <b>${guildName}</b>`;
  return sendTelegramPushNotification(chatId, message);
}

export async function sendEventNotification(
  chatId: string,
  eventName: string,
  timeLeft: string
): Promise<boolean> {
  const message = `🎉 <b>Event Alert!</b>\n\nThe <b>${eventName}</b> event is ending in ${timeLeft}!\n\nDon't miss out on rewards!`;
  return sendTelegramPushNotification(chatId, message);
}

export async function sendReferralNotification(
  chatId: string,
  referrerName: string,
  reward: number
): Promise<boolean> {
  const message = `👥 <b>New Referral!</b>\n\n${referrerName} joined using your link!\n\n💰 You earned: ${reward} FREE`;
  return sendTelegramPushNotification(chatId, message);
}

export async function sendStreakReminder(
  chatId: string,
  streakDays: number
): Promise<boolean> {
  const message = `🔥 <b>Don't break your streak!</b>\n\nYou have a ${streakDays}-day streak!\n\nClaim your daily reward to keep it going!`;
  return sendTelegramPushNotification(chatId, message);
}

export async function sendTournamentReminder(
  chatId: string,
  tournamentName: string,
  timeLeft: string
): Promise<boolean> {
  const message = `🏆 <b>Tournament Reminder</b>\n\nThe <b>${tournamentName}</b> tournament ends in ${timeLeft}!\n\nCheck your rank and compete for prizes!`;
  return sendTelegramPushNotification(chatId, message);
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
