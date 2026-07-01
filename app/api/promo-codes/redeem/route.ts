import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { initData, code } = await req.json();
    const user = await verifyTelegramInit(initData);

    if (!code) {
      return NextResponse.json({ error: 'Code required' }, { status: 400 });
    }

    // Get promo code
    const { data: promoCode } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (!promoCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    if (!promoCode.active || new Date(promoCode.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Code expired' }, { status: 400 });
    }

    if (promoCode.current_uses >= promoCode.max_uses) {
      return NextResponse.json({ error: 'Code limit reached' }, { status: 400 });
    }

    // Check if user already used
    const { data: existingUse } = await supabase
      .from('user_promo_uses')
      .select('id')
      .eq('telegram_id', user.id)
      .eq('promo_code_id', promoCode.id)
      .single();

    if (existingUse) {
      return NextResponse.json({ error: 'Already used' }, { status: 400 });
    }

    // Record use
    await supabase.from('user_promo_uses').insert({
      telegram_id: user.id,
      promo_code_id: promoCode.id,
    });

    // Update code usage
    await supabase
      .from('promo_codes')
      .update({ current_uses: promoCode.current_uses + 1 })
      .eq('id', promoCode.id);

    // Add reward
    const { data: userData } = await supabase
      .from('users')
      .select('free_balance')
      .eq('telegram_id', user.id)
      .single();

    const newBalance = (userData?.free_balance || 0) + promoCode.reward;
    await supabase.from('users').update({ free_balance: newBalance }).eq('telegram_id', user.id);

    logger.info('Promo code redeemed', { user_id: user.id, code, reward: promoCode.reward });

    return NextResponse.json({ success: true, reward: promoCode.reward });
  } catch (error: any) {
    logger.error('Failed to redeem code', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
