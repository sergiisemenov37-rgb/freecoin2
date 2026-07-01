import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const initData = req.nextUrl.searchParams.get('initData') || '';
    await verifyTelegramInit(initData);

    const { data: proposals } = await supabase
      .from('vote_proposals')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    return NextResponse.json({ proposals: proposals || [] });
  } catch (error: any) {
    logger.error('Failed to fetch proposals', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
