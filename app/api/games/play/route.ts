import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

const GAME_REWARDS: Record<string, number> = {
  clicker: 50,
  puzzle: 100,
  flashcards: 75,
  blackjack: 200,
};

export async function POST(req: NextRequest) {
  try {
    const { initData, gameId, score } = await req.json();
    const user = await verifyTelegramInit(initData);

    const reward = Math.floor((score / 100) * (GAME_REWARDS[gameId] || 50));

    // Save game session
    const { error: sessionError } = await supabase.from('game_sessions').insert({
      telegram_id: user.id,
      game_id: gameId,
      score,
      reward,
      completed: true,
    });

    if (sessionError) throw sessionError;

    // Add reward to user balance
    const { data: userData } = await supabase
      .from('users')
      .select('free_balance')
      .eq('telegram_id', user.id)
      .single();

    const newBalance = (userData?.free_balance || 0) + reward;
    await supabase.from('users').update({ free_balance: newBalance }).eq('telegram_id', user.id);

    logger.info('Game completed', { user_id: user.id, game_id: gameId, score, reward });

    return NextResponse.json({ success: true, reward });
  } catch (error: any) {
    logger.error('Failed to save game', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
