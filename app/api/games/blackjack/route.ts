import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { bet: number; result: string } = await req.json();
    const { bet, result } = body;

    if (!bet || bet <= 0) {
      return NextResponse.json({ error: "Invalid bet amount" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get user balance
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("free_balance")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.free_balance < bet) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    let winAmount = 0;
    let transactionType = "blackjack_play";

    switch (result) {
      case 'win':
      case 'dealer_bust':
        winAmount = bet * 2;
        transactionType = "blackjack_win";
        break;
      case 'lose':
      case 'bust':
        winAmount = 0;
        transactionType = "blackjack_lose";
        break;
      case 'push':
        winAmount = bet;
        transactionType = "blackjack_push";
        break;
    }

    // Update balance
    const newBalance = user.free_balance - bet + winAmount;
    await supabase
      .from("users")
      .update({ free_balance: newBalance })
      .eq("telegram_id", auth.telegramId);

    // Record transaction
    await supabase.from("transactions").insert({
      telegram_id: auth.telegramId,
      type: transactionType,
      amount: winAmount - bet,
      description: `Blackjack: ${result}`
    });

    // Update games played
    await supabase
      .from("users")
      .update({ games_played: supabase.raw(`games_played + 1`) })
      .eq("telegram_id", auth.telegramId);

    return NextResponse.json({
      success: true,
      result,
      winAmount,
      newBalance,
      profit: winAmount - bet
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to play blackjack";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
