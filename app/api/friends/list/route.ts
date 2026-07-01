import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const initData = req.nextUrl.searchParams.get('initData') || '';
    const user = await verifyTelegramInit(initData);

    const { data: friends } = await supabase
      .from('friends')
      .select('*')
      .eq('telegram_id', user.id)
      .eq('status', 'accepted');

    return NextResponse.json({ friends: friends || [] });
  } catch (error: any) {
    logger.error('Failed to fetch friends', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
