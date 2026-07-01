import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { initData, toTelegramId, content } = await req.json();
    const user = await verifyTelegramInit(initData);

    if (!content || !toTelegramId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase.from('messages').insert({
      from_telegram_id: user.id,
      to_telegram_id: toTelegramId,
      content,
      type: 'text',
    });

    if (error) throw error;

    logger.info('Message sent', { from: user.id, to: toTelegramId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Failed to send message', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
