import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

// Achievement definitions
const ACHIEVEMENTS = [
  {
    id: "first_mine",
    name: "First Steps",
    description: "Mine your first FREEcoin",
    icon: "🎯",
    reward: 10,
    requirement: { type: "total_mined", value: 1 }
  },
  {
    id: "miner_level_5",
    name: "Novice Miner",
    description: "Reach miner level 5",
    icon: "⛏️",
    reward: 100,
    requirement: { type: "miner_level", value: 5 }
  },
  {
    id: "miner_level_10",
    name: "Expert Miner",
    description: "Reach miner level 10",
    icon: "💎",
    reward: 500,
    requirement: { type: "miner_level", value: 10 }
  },
  {
    id: "balance_1000",
    name: "Thousand Club",
    description: "Accumulate 1000 FREEcoins",
    icon: "💰",
    reward: 50,
    requirement: { type: "balance", value: 1000 }
  },
  {
    id: "balance_10000",
    name: "Ten Thousand Club",
    description: "Accumulate 10,000 FREEcoins",
    icon: "🏆",
    reward: 500,
    requirement: { type: "balance", value: 10000 }
  },
  {
    id: "referrals_5",
    name: "Social Butterfly",
    description: "Refer 5 friends",
    icon: "👥",
    reward: 200,
    requirement: { type: "referrals", value: 5 }
  },
  {
    id: "referrals_20",
    name: "Influencer",
    description: "Refer 20 friends",
    icon: "🌟",
    reward: 1000,
    requirement: { type: "referrals", value: 20 }
  },
  {
    id: "tasks_10",
    name: "Task Master",
    description: "Complete 10 daily tasks",
    icon: "✅",
    reward: 100,
    requirement: { type: "tasks_completed", value: 10 }
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    reward: 150,
    requirement: { type: "streak", value: 7 }
  },
  {
    id: "streak_30",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "👑",
    reward: 1000,
    requirement: { type: "streak", value: 30 }
  },
  {
    id: "games_50",
    name: "Gamer",
    description: "Play 50 games",
    icon: "🎮",
    reward: 200,
    requirement: { type: "games_played", value: 50 }
  },
  {
    id: "guild_member",
    name: "Team Player",
    description: "Join a guild",
    icon: "🏰",
    reward: 100,
    requirement: { type: "guild_id", value: "not_null" }
  }
];

export async function GET(req: Request) {\n  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = getSupabaseAdmin();

    // Get user data
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's unlocked achievements
    const { data: unlockedAchievements } = await supabase
      .from("user_achievements")
      .select("achievement_id, unlocked_at")
      .eq("telegram_id", auth.telegramId);

    const unlockedIds = new Set(unlockedAchievements?.map((a: any) => a.achievement_id) || []);

    // Check which achievements are unlocked and which are in progress
    const achievementsWithStatus = ACHIEVEMENTS.map((achievement) => {
      const isUnlocked = unlockedIds.has(achievement.id);
      let progress = 0;
      let canUnlock = false;

      const req = achievement.requirement;
      const reqValue = typeof req.value === 'number' ? req.value : 0;

      switch (req.type) {
        case "total_mined":
          progress = Math.min(100, ((user.total_mined as number) || 0) / reqValue * 100);
          canUnlock = ((user.total_mined as number) || 0) >= reqValue;
          break;
        case "miner_level":
          progress = Math.min(100, ((user.miner_level as number) || 0) / reqValue * 100);
          canUnlock = ((user.miner_level as number) || 0) >= reqValue;
          break;
        case "balance":
          progress = Math.min(100, ((user.free_balance as number) || 0) / reqValue * 100);
          canUnlock = ((user.free_balance as number) || 0) >= reqValue;
          break;
        case "referrals":
          progress = Math.min(100, ((user.referral_count as number) || 0) / reqValue * 100);
          canUnlock = ((user.referral_count as number) || 0) >= reqValue;
          break;
        case "tasks_completed":
          progress = Math.min(100, ((user.tasks_completed as number) || 0) / reqValue * 100);
          canUnlock = ((user.tasks_completed as number) || 0) >= reqValue;
          break;
        case "streak":
          progress = Math.min(100, ((user.streak as number) || 0) / reqValue * 100);
          canUnlock = ((user.streak as number) || 0) >= reqValue;
          break;
        case "games_played":
          progress = Math.min(100, ((user.games_played as number) || 0) / reqValue * 100);
          canUnlock = ((user.games_played as number) || 0) >= reqValue;
          break;
        case "guild_id":
          progress = user.guild_id ? 100 : 0;
          canUnlock = !!user.guild_id;
          break;
      }

      return {
        ...achievement,
        unlocked: isUnlocked,
        progress: Math.round(progress),
        canUnlock: canUnlock && !isUnlocked
      };
    });

    return NextResponse.json({ achievements: achievementsWithStatus });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch achievements";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
