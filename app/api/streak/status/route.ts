import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

const STREAK_REWARDS = {
  1: 10,
  2: 15,
  3: 20,
  4: 25,
  5: 35,
  6: 50,
  7: 75,
  8: 100,
  9: 125,
  10: 150,
  14: 200,
  21: 300,
  30: 500,
  60: 1000,
  90: 1500,
  100: 2000
};

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: user } = await supabase
      .from("users")
      .select("streak, last_streak_date")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0];
    const lastStreakDate = user.last_streak_date ? user.last_streak_date.split('T')[0] : null;
    
    const canClaim = lastStreakDate !== today;
    const streak = user.streak || 0;
    
    // Calculate next reward
    let nextReward = 10;
    const rewardKeys = Object.keys(STREAK_REWARDS).map(Number).sort((a, b) => a - b);
    for (const key of rewardKeys) {
      if (streak + 1 >= key) {
        nextReward = STREAK_REWARDS[key as keyof typeof STREAK_REWARDS];
      }
    }

    // Check milestones
    const milestones = [7, 14, 21, 30, 60, 90, 100];
    const nextMilestone = milestones.find(m => streak < m);

    return NextResponse.json({
      streak,
      canClaim,
      lastStreakDate,
      nextReward,
      nextMilestone,
      rewards: STREAK_REWARDS
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get streak status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
