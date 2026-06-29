import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { miniGames } from "../../../../lib/miniGames";

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = getSupabaseAdmin();

    // Get last played times for cooldown check
    const { data: sessions } = await supabase
      .from("game_sessions")
      .select("game_id, started_at")
      .eq("telegram_id", auth.telegramId)
      .eq("completed", true)
      .order("started_at", { ascending: false });

    // Create a map of last played times
    const lastPlayedMap: Record<string, string> = {};
    if (sessions) {
      sessions.forEach(session => {
        if (!lastPlayedMap[session.game_id]) {
          lastPlayedMap[session.game_id] = session.started_at;
        }
      });
    }

    // Add cooldown info to games
    const gamesWithCooldown = miniGames.map(game => ({
      ...game,
      canPlay: !lastPlayedMap[game.id] || (() => {
        const lastTime = new Date(lastPlayedMap[game.id]);
        const now = new Date();
        const diffMinutes = (now.getTime() - lastTime.getTime()) / (1000 * 60);
        return diffMinutes >= game.cooldown;
      })(),
      lastPlayed: lastPlayedMap[game.id] || null
    }));

    return NextResponse.json({ games: gamesWithCooldown });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load games";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
