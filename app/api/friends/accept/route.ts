import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { initData, requestId } = await req.json();
    const user = await verifyTelegramInit(initData);

    // Get friend request
    const { data: request } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Update request status
    await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    // Create bidirectional friendship
    await supabase.from('friends').insert([
      {
        telegram_id: request.from_telegram_id,
        friend_telegram_id: request.to_telegram_id,
        status: 'accepted',
      },
      {
        telegram_id: request.to_telegram_id,
        friend_telegram_id: request.from_telegram_id,
        status: 'accepted',
      },
    ]);

    logger.info('Friend request accepted', { between: [request.from_telegram_id, request.to_telegram_id] });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Failed to accept friend request', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
