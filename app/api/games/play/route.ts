import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { miniGames, canPlayGame, calculateClickerReward, calculateGuessReward } from "../../../../lib/miniGames";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { gameId: string; score?: number; clicks?: number; attempts?: number } = await request.json();
    const { gameId, score, clicks, attempts } = body;

    if (!gameId) {
      return NextResponse.json({ error: "Game ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get game details
    const game = miniGames.find(g => g.id === gameId);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Check cooldown
    const { data: lastSession } = await supabase
      .from("game_sessions")
      .select("started_at")
      .eq("telegram_id", auth.telegramId)
      .eq("game_id", gameId)
      .eq("completed", true)
      .order("started_at", { ascending: false })
      .limit(1)
      .single();

    if (lastSession && !canPlayGame(lastSession.started_at, game.cooldown)) {
      return NextResponse.json({ error: "Game on cooldown" }, { status: 429 });
    }

    // Calculate reward based on game type
    let reward = 0;
    let completed = false;

    if (game.type === 'clicker' && clicks !== undefined) {
      const duration = gameId.includes('pro') ? 5 : 10;
      reward = calculateClickerReward(clicks, duration);
      completed = true;
    } else if (game.type === 'guess' && attempts !== undefined) {
      const maxAttempts = gameId.includes('hard') ? 15 : 10;
      if (score === 1) { // Won
        reward = calculateGuessReward(attempts, maxAttempts);
        completed = true;
      } else {
        reward = 0;
        completed = true;
      }
    } else {
      reward = game.reward;
      completed = score !== undefined && score > 0;
    }

    // Save game session
    const { error: sessionError } = await supabase
      .from("game_sessions")
      .insert([{
        telegram_id: auth.telegramId,
        game_id: gameId,
        score: score || 0,
        reward,
        completed,
        completed_at: completed ? new Date().toISOString() : null
      }]);

    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 500 });
    }

    // Add reward to balance if completed
    if (completed && reward > 0) {
      await supabase
        .from("users")
        .update({ free_balance: supabase.rpc('increment', { amount: reward }) })
        .eq("telegram_id", auth.telegramId);

      await supabase.from("transactions").insert([{
        telegram_id: auth.telegramId,
        type: "game",
        amount: reward,
        description: `Game reward: ${game.name}`
      }]);
    }

    return NextResponse.json({ success: true, reward, completed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to play game";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
