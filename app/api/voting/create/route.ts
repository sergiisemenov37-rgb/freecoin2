import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { createProposal, VOTING_DURATION_DAYS } from "../../../../lib/voting";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { title: string; description: string; type: string } = await request.json();
    const { title, description, type } = body;

    if (!title || !description || !type) {
      return NextResponse.json({ error: "Title, description, and type are required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get user info
    const { data: user } = await supabase
      .from("users")
      .select("first_name")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create proposal
    const now = new Date();
    const endsAt = new Date(now);
    endsAt.setDate(now.getDate() + VOTING_DURATION_DAYS);

    const { error } = await supabase
      .from("vote_proposals")
      .insert([{
        title,
        description,
        type,
        proposer_id: auth.telegramId,
        proposer_name: user.first_name || "User",
        created_at: now.toISOString(),
        ends_at: endsAt.toISOString(),
        status: "active",
        votes_for: 0,
        votes_against: 0,
        total_votes: 0,
        min_votes_required: 10
      }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Proposal created" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create proposal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
