import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣"];
const PAYOUTS = {
  "🍒": 2,
  "🍋": 3,
  "🍊": 5,
  "🍇": 8,
  "💎": 15,
  "7️⃣": 25,
};

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { bet: number } = await req.json();
    const { bet } = body;

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

    // Generate random reels
    const result = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    ];

    // Check for wins
    let win = 0;
    const counts = result.reduce((acc, symbol) => {
      acc[symbol] = (acc[symbol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 3 of a kind
    for (const [symbol, count] of Object.entries(counts)) {
      if (count === 3) {
        win = bet * PAYOUTS[symbol as keyof typeof PAYOUTS];
        break;
      }
    }

    // 2 of a kind (smaller payout)
    if (win === 0) {
      for (const [symbol, count] of Object.entries(counts)) {
        if (count === 2) {
          win = Math.floor(bet * 0.5);
          break;
        }
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
        description: "Slots win"
      }]);
    } else {
      await supabase.from("transactions").insert([{
        telegram_id: auth.telegramId,
        type: "game",
        amount: -bet,
        description: "Slots bet"
      }]);
    }

    return NextResponse.json({ result, win });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to play slots";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
