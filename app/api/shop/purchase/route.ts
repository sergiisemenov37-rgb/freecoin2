import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

const SHOP_ITEMS: Record<string, any> = {
  skin_red: { price: 500, type: 'cosmetic' },
  skin_blue: { price: 500, type: 'cosmetic' },
  boost_2x: { price: 1000, type: 'boost' },
  energy_pack: { price: 300, type: 'consumable' },
};

export async function POST(req: NextRequest) {
  try {
    const { initData, itemId } = await req.json();
    const user = await verifyTelegramInit(initData);

    const item = SHOP_ITEMS[itemId];
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Get user balance
    const { data: userData } = await supabase
      .from('users')
      .select('free_balance')
      .eq('telegram_id', user.id)
      .single();

    if ((userData?.free_balance || 0) < item.price) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Create purchase record
    await supabase.from('user_purchases').insert({
      telegram_id: user.id,
      item_id: itemId,
      item_type: item.type,
      price: item.price,
    });

    // Update balance
    const newBalance = userData!.free_balance - item.price;
    await supabase.from('users').update({ free_balance: newBalance }).eq('telegram_id', user.id);

    logger.info('Item purchased', { user_id: user.id, item_id: itemId, price: item.price });

    return NextResponse.json({ success: true, newBalance });
  } catch (error: any) {
    logger.error('Failed to purchase item', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
