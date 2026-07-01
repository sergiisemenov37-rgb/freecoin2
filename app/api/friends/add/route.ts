import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { initData, friendTelegramId } = await req.json();
    const user = await verifyTelegramInit(initData);

    if (!friendTelegramId) {
      return NextResponse.json({ error: 'Friend ID required' }, { status: 400 });
    }

    // Check if friend exists
    const { data: friendData } = await supabase
      .from('users')
      .select('telegram_id')
      .eq('telegram_id', friendTelegramId)
      .single();

    if (!friendData) {
      return NextResponse.json({ error: 'Friend not found' }, { status: 404 });
    }

    // Create friend request
    const { error } = await supabase.from('friend_requests').insert({
      from_telegram_id: user.id,
      to_telegram_id: friendTelegramId,
      status: 'pending',
    });

    if (error) throw error;

    logger.info('Friend request sent', { from: user.id, to: friendTelegramId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Failed to add friend', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
