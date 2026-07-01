import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { userId, subscription } = await req.json();

    const { error } = await supabase.from('push_subscriptions').insert({
      user_id: userId,
      endpoint: subscription.endpoint,
      auth: subscription.keys.auth,
      p256dh: subscription.keys.p256dh,
    });

    if (error) throw error;

    logger.info('Push subscription saved', { user_id: userId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Failed to save push subscription', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
