import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { initData, proposalId, choice } = await req.json();
    const user = await verifyTelegramInit(initData);

    if (!['for', 'against'].includes(choice)) {
      return NextResponse.json({ error: 'Invalid choice' }, { status: 400 });
    }

    // Check if already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('proposal_id', proposalId)
      .eq('voter_id', user.id)
      .single();

    if (existingVote) {
      return NextResponse.json({ error: 'Already voted' }, { status: 400 });
    }

    // Add vote
    await supabase.from('votes').insert({
      proposal_id: proposalId,
      voter_id: user.id,
      choice,
    });

    // Update proposal counters
    const { data: proposal } = await supabase
      .from('vote_proposals')
      .select('*')
      .eq('id', proposalId)
      .single();

    const field = choice === 'for' ? 'votes_for' : 'votes_against';
    await supabase
      .from('vote_proposals')
      .update({
        [field]: proposal[field] + 1,
        total_votes: proposal.total_votes + 1,
      })
      .eq('id', proposalId);

    logger.info('Vote cast', { user_id: user.id, proposal_id: proposalId, choice });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Failed to vote', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
