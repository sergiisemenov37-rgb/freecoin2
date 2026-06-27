import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { castVote, canVote } from "../../../../lib/voting";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { proposalId: number; choice: string } = await request.json();
    const { proposalId, choice } = body;

    if (!proposalId || !choice || !['for', 'against'].includes(choice)) => {
      return NextResponse.json({ error: "Invalid proposal ID or choice" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get proposal
    const { data: proposal } = await supabase
      .from("vote_proposals")
      .select("*")
      .eq("id", proposalId)
      .single();

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Check if can vote
    if (!canVote(proposal, null)) {
      return NextResponse.json({ error: "Cannot vote on this proposal" }, { status: 400 });
    }

    // Check if already voted
    const { data: existingVote } = await supabase
      .from("votes")
      .select("*")
      .eq("proposal_id", proposalId)
      .eq("voter_id", auth.telegramId)
      .single();

    if (existingVote) {
      return NextResponse.json({ error: "Already voted" }, { status: 400 });
    }

    // Cast vote
    const updatedProposal = castVote(proposal, choice as 'for' | 'against');

    // Update proposal
    await supabase
      .from("vote_proposals")
      .update({
        votes_for: updatedProposal.votes_for,
        votes_against: updatedProposal.votes_against,
        total_votes: updatedProposal.total_votes,
        status: updatedProposal.status
      })
      .eq("id", proposalId);

    // Add vote record
    await supabase.from("votes").insert([{
      proposal_id: proposalId,
      voter_id: auth.telegramId,
      choice,
      created_at: new Date().toISOString()
    }]);

    return NextResponse.json({ success: true, proposal: updatedProposal });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to vote";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
