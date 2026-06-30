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

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

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

    const today = new Date().toISOString().split('T')[0];
    const lastStreakDate = user.last_streak_date ? user.last_streak_date.split('T')[0] : null;

    // Check if already claimed today
    if (lastStreakDate === today) {
      return NextResponse.json({ error: "Already claimed today" }, { status: 400 });
    }

    // Check if streak is broken (more than 1 day gap)
    if (lastStreakDate) {
      const lastDate = new Date(lastStreakDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        // Reset streak
        await supabase
          .from("users")
          .update({ 
            streak: 1,
            last_streak_date: today
          })
          .eq("telegram_id", auth.telegramId);
        
        const reward = STREAK_REWARDS[1] || 10;
        
        await supabase
          .from("users")
          .update({ free_balance: supabase.rpc('increment', { amount: reward }) })
          .eq("telegram_id", auth.telegramId);

        await supabase.from("transactions").insert([{
          telegram_id: auth.telegramId,
          type: "streak",
          amount: reward,
          description: "Daily streak reward (streak reset)"
        }]);

        return NextResponse.json({ 
          success: true, 
          streak: 1, 
          reward,
          message: "Streak reset! Starting new streak."
        });
      }
    }

    // Increment streak
    const newStreak = (user.streak || 0) + 1;
    
    // Find reward
    let reward = 10;
    const rewardKeys = Object.keys(STREAK_REWARDS).map(Number).sort((a, b) => a - b);
    for (const key of rewardKeys) {
      if (newStreak >= key) {
        reward = STREAK_REWARDS[key as keyof typeof STREAK_REWARDS];
      }
    }

    // Update user
    await supabase
      .from("users")
      .update({ 
        streak: newStreak,
        last_streak_date: today
      })
      .eq("telegram_id", auth.telegramId);

    // Add reward
    await supabase
      .from("users")
      .update({ free_balance: supabase.rpc('increment', { amount: reward }) })
      .eq("telegram_id", auth.telegramId);

    await supabase.from("transactions").insert([{
      telegram_id: auth.telegramId,
      type: "streak",
      amount: reward,
      description: `Daily streak reward (${newStreak} day streak)`
    }]);

    return NextResponse.json({ 
      success: true, 
      streak: newStreak, 
      reward,
      message: `Streak claimed! ${newStreak} day streak.`
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to claim streak";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
