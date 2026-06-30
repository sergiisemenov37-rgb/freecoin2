import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../lib/server/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "mining";
    const limit = parseInt(searchParams.get("limit") || "50");

    const supabase = getSupabaseAdmin();

    let query;
    let orderBy;

    switch (type) {
      case "mining":
        orderBy = "total_mined";
        break;
      case "balance":
        orderBy = "free_balance";
        break;
      case "referrals":
        orderBy = "referral_count";
        break;
      case "miner_level":
        orderBy = "miner_level";
        break;
      case "games":
        orderBy = "games_played";
        break;
      default:
        orderBy = "total_mined";
    }

    // Get leaderboard
    const { data: leaderboard } = await supabase
      .from("users")
      .select("telegram_id, first_name, total_mined, free_balance, referral_count, miner_level, games_played")
      .order(orderBy, { ascending: false })
      .limit(limit);

    // Get current user's rank
    const auth = await authenticateRequest(req);
    let userRank = null;
    let userData = null;

    if (auth.ok) {
      const { data: currentUser } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", auth.telegramId)
        .single();

      if (currentUser) {
        userData = currentUser;
        
        // Calculate rank
        const { data: rankData } = await supabase
          .from("users")
          .select("telegram_id")
          .gte(orderBy, currentUser[orderBy])
          .order(orderBy, { ascending: false });

        if (rankData) {
          userRank = rankData.findIndex(u => u.telegram_id === auth.telegramId) + 1;
        }
      }
    }

    return NextResponse.json({
      type,
      leaderboard: leaderboard?.map((user, index) => ({
        rank: index + 1,
        telegram_id: user.telegram_id,
        name: user.first_name || "Anonymous",
        total_mined: user.total_mined || 0,
        balance: user.free_balance || 0,
        referrals: user.referral_count || 0,
        miner_level: user.miner_level || 1,
        games_played: user.games_played || 0,
        isCurrentUser: auth.ok && user.telegram_id === auth.telegramId
      })) || [],
      userRank,
      userData
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch leaderboard";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
