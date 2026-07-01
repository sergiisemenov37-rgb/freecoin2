import { cacheManager } from './cache';

interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, string>;
}

export class NotificationService {
  private vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

  /**
   * Subscribe user to push notifications
   */
  async subscribeUser(
    userId: string,
    subscription: PushSubscriptionJSON
  ): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subscription }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to notifications');
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  }

  /**
   * Send notification to user
   */
  async sendNotification(
    userId: string,
    notification: PushNotificationPayload
  ): Promise<void> {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, notification }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  /**
   * Get VAPID public key for client
   */
  getVapidPublicKey(): string {
    return this.vapidPublicKey;
  }
}

export const notificationService = new NotificationService();
