import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { bet: number; betType: string; betValue: string } = await req.json();
    const { bet, betType, betValue } = body;

    if (!bet || bet <= 0) {
      return NextResponse.json({ error: "Invalid bet" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get user balance
    const { data: user } = await supabase
      .from("users")
      .select("free_balance")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (!user || user.free_balance < bet) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Spin roulette (0-36)
    const result = Math.floor(Math.random() * 37);

    // Determine result color
    let resultColor = "green";
    if (result !== 0) {
      resultColor = RED_NUMBERS.includes(result) ? "red" : "black";
    }

    // Determine result parity
    const resultParity = result === 0 ? "none" : result % 2 === 0 ? "even" : "odd";

    // Calculate win
    let win = 0;
    let multiplier = 0;

    if (betType === "color") {
      if (betValue === resultColor) {
        multiplier = resultColor === "green" ? 35 : 2;
        win = bet * multiplier;
      }
    } else if (betType === "parity") {
      if (betValue === resultParity) {
        multiplier = 2;
        win = bet * multiplier;
      }
    } else if (betType === "number") {
      if (parseInt(betValue) === result) {
        multiplier = 35;
        win = bet * multiplier;
      }
    }

    // Deduct bet
    await supabase
      .from("users")
      .update({ free_balance: user.free_balance - bet })
      .eq("telegram_id", auth.telegramId);

    // Add win if any
    if (win > 0) {
      await supabase
        .from("users")
        .update({ free_balance: supabase.rpc('increment', { amount: win }) })
        .eq("telegram_id", auth.telegramId);

      await supabase.from("transactions").insert([{
        telegram_id: auth.telegramId,
        type: "game",
        amount: win - bet,
        description: `Roulette win (${betType}: ${betValue})`
      }]);
    } else {
      await supabase.from("transactions").insert([{
        telegram_id: auth.telegramId,
        type: "game",
        amount: -bet,
        description: `Roulette bet (${betType}: ${betValue})`
      }]);
    }

    return NextResponse.json({ result, win });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to play roulette";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
