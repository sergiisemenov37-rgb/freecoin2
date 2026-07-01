import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const initData = req.nextUrl.searchParams.get('initData') || '';
    await verifyTelegramInit(initData);

    const { data: tournaments } = await supabase
      .from('tournaments')
      .select('*')
      .order('start_date', { ascending: false });

    return NextResponse.json({ tournaments: tournaments || [] });
  } catch (error: any) {
    logger.error('Failed to fetch tournaments', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
