import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { bet: number; prediction: "low" | "high" } = await req.json();
    const { bet, prediction } = body;

    if (!bet || bet <= 0) {
      return NextResponse.json({ error: "Invalid bet" }, { status: 400 });
    }

    if (!prediction || !["low", "high"].includes(prediction)) {
      return NextResponse.json({ error: "Invalid prediction" }, { status: 400 });
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

    // Roll dice (1-100)
    const result = Math.floor(Math.random() * 100) + 1;

    // Check win
    const isLow = result <= 50;
    const won = (prediction === "low" && isLow) || (prediction === "high" && !isLow);
    const win = won ? bet * 2 : 0;

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
        description: "Dice win"
      }]);
    } else {
      await supabase.from("transactions").insert([{
        telegram_id: auth.telegramId,
        type: "game",
        amount: -bet,
        description: "Dice bet"
      }]);
    }

    return NextResponse.json({ result, win });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to play dice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
