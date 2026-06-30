import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

const ACHIEVEMENTS = [
  {
    id: "first_mine",
    name: "First Steps",
    reward: 10
  },
  {
    id: "miner_level_5",
    name: "Novice Miner",
    reward: 100
  },
  {
    id: "miner_level_10",
    name: "Expert Miner",
    reward: 500
  },
  {
    id: "balance_1000",
    name: "Thousand Club",
    reward: 50
  },
  {
    id: "balance_10000",
    name: "Ten Thousand Club",
    reward: 500
  },
  {
    id: "referrals_5",
    name: "Social Butterfly",
    reward: 200
  },
  {
    id: "referrals_20",
    name: "Influencer",
    reward: 1000
  },
  {
    id: "tasks_10",
    name: "Task Master",
    reward: 100
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    reward: 150
  },
  {
    id: "streak_30",
    name: "Monthly Master",
    reward: 1000
  },
  {
    id: "games_50",
    name: "Gamer",
    reward: 200
  },
  {
    id: "guild_member",
    name: "Team Player",
    reward: 100
  }
];

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { achievementId: string } = await req.json();
    const { achievementId } = body;

    if (!achievementId) {
      return NextResponse.json({ error: "Achievement ID is required" }, { status: 400 });
    }

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
    }

    const supabase = getSupabaseAdmin();

    // Check if already unlocked
    const { data: existing } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("telegram_id", auth.telegramId)
      .eq("achievement_id", achievementId)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Achievement already unlocked" }, { status: 400 });
    }

    // Unlock achievement
    const { error: unlockError } = await supabase
      .from("user_achievements")
      .insert([{
        telegram_id: auth.telegramId,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString()
      }]);

    if (unlockError) {
      return NextResponse.json({ error: unlockError.message }, { status: 500 });
    }

    // Add reward to balance
    await supabase
      .from("users")
      .update({ free_balance: supabase.rpc('increment', { amount: achievement.reward }) })
      .eq("telegram_id", auth.telegramId);

    // Add transaction
    await supabase.from("transactions").insert([{
      telegram_id: auth.telegramId,
      type: "achievement",
      amount: achievement.reward,
      description: `Achievement: ${achievement.name}`
    }]);

    return NextResponse.json({ 
      success: true, 
      achievement: achievement.name, 
      reward: achievement.reward 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to claim achievement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
