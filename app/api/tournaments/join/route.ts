import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { initData, tournamentId } = await req.json();
    const user = await verifyTelegramInit(initData);

    // Get tournament
    const { data: tournament } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    if (tournament.current_participants >= tournament.max_participants) {
      return NextResponse.json({ error: 'Tournament is full' }, { status: 400 });
    }

    // Check if already joined
    const { data: existingParticipant } = await supabase
      .from('tournament_participants')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('telegram_id', user.id)
      .single();

    if (existingParticipant) {
      return NextResponse.json({ error: 'Already joined' }, { status: 400 });
    }

    // Add participant
    await supabase.from('tournament_participants').insert({
      tournament_id: tournamentId,
      telegram_id: user.id,
      score: 0,
      rank: tournament.current_participants + 1,
    });

    // Update current_participants
    await supabase
      .from('tournaments')
      .update({ current_participants: tournament.current_participants + 1 })
      .eq('id', tournamentId);

    logger.info('Joined tournament', { user_id: user.id, tournament_id: tournamentId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Failed to join tournament', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
