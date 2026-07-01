import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { initData, count } = await req.json();
    const user = await verifyTelegramInit(initData);

    const TICKET_PRICE = 50;
    const totalCost = count * TICKET_PRICE;

    // Get user balance
    const { data: userData } = await supabase
      .from('users')
      .select('free_balance')
      .eq('telegram_id', user.id)
      .single();

    if ((userData?.free_balance || 0) < totalCost) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Get active lottery draw
    const { data: draw } = await supabase
      .from('lottery_draws')
      .select('*')
      .eq('status', 'active')
      .single();

    if (!draw) {
      return NextResponse.json({ error: 'No active lottery' }, { status: 404 });
    }

    // Create tickets
    const tickets = Array.from({ length: count }, (_, i) => ({
      draw_id: draw.id,
      telegram_id: user.id,
      ticket_number: Math.floor(Math.random() * 1000000),
    }));

    await supabase.from('lottery_tickets').insert(tickets);

    // Update draw stats
    await supabase
      .from('lottery_draws')
      .update({
        total_tickets: draw.total_tickets + count,
        prize_pool: draw.prize_pool + totalCost,
      })
      .eq('id', draw.id);

    // Update user balance
    const newBalance = userData!.free_balance - totalCost;
    await supabase.from('users').update({ free_balance: newBalance }).eq('telegram_id', user.id);

    logger.info('Lottery tickets purchased', { user_id: user.id, count, totalCost });

    return NextResponse.json({ success: true, count, totalCost, drawId: draw.id });
  } catch (error: any) {
    logger.error('Failed to buy lottery tickets', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
