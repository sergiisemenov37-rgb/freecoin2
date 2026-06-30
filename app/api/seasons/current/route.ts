import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

// Season definitions (in production, these would be stored in database)
const SEASONS = [
  {
    id: "season_1",
    name: "Genesis Season",
    description: "The beginning of FREECOIN mining",
    icon: "🌟",
    startDate: "2026-06-01T00:00:00Z",
    endDate: "2026-08-31T23:59:59Z",
    isActive: true,
    rewards: [
      { rank: 1, reward: 10000, title: "Legendary Miner" },
      { rank: 2, reward: 5000, title: "Elite Miner" },
      { rank: 3, reward: 2500, title: "Master Miner" },
      { rank: "4-10", reward: 1000, title: "Expert Miner" },
      { rank: "11-50", reward: 500, title: "Skilled Miner" },
      { rank: "51-100", reward: 250, title: "Apprentice Miner" },
      { rank: "101-500", reward: 100, title: "Novice Miner" }
    ]
  },
  {
    id: "season_2",
    name: "Summer Mining",
    description: "Hot mining rewards",
    icon: "☀️",
    startDate: "2026-09-01T00:00:00Z",
    endDate: "2026-11-30T23:59:59Z",
    isActive: false,
    rewards: [
      { rank: 1, reward: 15000, title: "Summer Champion" },
      { rank: 2, reward: 7500, title: "Summer Elite" },
      { rank: 3, reward: 3750, title: "Summer Master" }
    ]
  }
];

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    // Get current season
    const currentSeason = SEASONS.find(season => 
      season.isActive && now >= season.startDate && now <= season.endDate
    );

    if (!currentSeason) {
      return NextResponse.json({ season: null, message: "No active season" });
    }

    // Calculate season progress
    const startTime = new Date(currentSeason.startDate);
    const endTime = new Date(currentSeason.endDate);
    const nowTime = new Date();
    const totalDuration = endTime.getTime() - startTime.getTime();
    const elapsed = nowTime.getTime() - startTime.getTime();
    const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    // Get user's season rank (simplified - in production would use leaderboard)
    const { data: user } = await supabase
      .from("users")
      .select("total_mined")
      .eq("telegram_id", auth.telegramId)
      .single();

    // Simulate rank based on total mined (in production, use actual leaderboard)
    const userRank = user ? Math.max(1, Math.floor(1000 / (user.total_mined || 1) * 10)) : 1000;

    return NextResponse.json({
      season: {
        ...currentSeason,
        progress: Math.round(progress),
        remainingTime: {
          days: Math.floor((endTime.getTime() - nowTime.getTime()) / (1000 * 60 * 60 * 24))
        },
        userRank
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch season";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
