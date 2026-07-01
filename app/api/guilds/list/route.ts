import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const initData = req.nextUrl.searchParams.get('initData') || '';
    await verifyTelegramInit(initData);

    const { data: guilds } = await supabase
      .from('guilds')
      .select('*')
      .order('total_power', { ascending: false })
      .limit(100);

    return NextResponse.json({ guilds: guilds || [] });
  } catch (error: any) {
    logger.error('Failed to fetch guilds', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
