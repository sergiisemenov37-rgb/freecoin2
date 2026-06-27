import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { canJoinTournament } from "../../../../lib/tournaments";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { tournamentId: number } = await request.json();
    const { tournamentId } = body;

    if (!tournamentId) {
      return NextResponse.json({ error: "Tournament ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get user balance
    const { data: user } = await supabase
      .from("users")
      .select("free_balance")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get tournament details
    const { data: tournament } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", tournamentId)
      .single();

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    // Check if can join
    if (!canJoinTournament(tournament, user.free_balance)) {
      return NextResponse.json({ error: "Cannot join tournament" }, { status: 400 });
    }

    // Check if already joined
    const { data: existingParticipant } = await supabase
      .from("tournament_participants")
      .select("*")
      .eq("tournament_id", tournamentId)
      .eq("telegram_id", auth.telegramId)
      .single();

    if (existingParticipant) {
      return NextResponse.json({ error: "Already joined" }, { status: 400 });
    }

    // Deduct entry fee
    await supabase
      .from("users")
      .update({ free_balance: user.free_balance - tournament.entry_fee })
      .eq("telegram_id", auth.telegramId);

    // Add participant
    await supabase.from("tournament_participants").insert([{
      tournament_id: tournamentId,
      telegram_id: auth.telegramId,
      score: 0,
      joined_at: new Date().toISOString()
    }]);

    // Update tournament participant count
    await supabase
      .from("tournaments")
      .update({ 
        current_participants: tournament.current_participants + 1,
        status: "active" as const
      })
      .eq("id", tournamentId);

    // Add transaction
    await supabase.from("transactions").insert([{
      telegram_id: auth.telegramId,
      type: "tournament",
      amount: -tournament.entry_fee,
      description: `Joined tournament: ${tournament.name}`
    }]);

    return NextResponse.json({ success: true, tournament });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to join tournament";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
