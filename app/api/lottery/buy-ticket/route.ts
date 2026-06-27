import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { TICKET_PRICE, generateTicketNumber } from "../../../../lib/lottery";
import { getLotteryTicketPrice, getVIPStatus } from "../../../../lib/vip";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { count: number } = await request.json();
    const { count = 1 } = body;

    if (count < 1 || count > 50) {
      return NextResponse.json({ error: "Invalid ticket count" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get user details for VIP pricing
    const { data: user } = await supabase
      .from("users")
      .select("free_balance, miner_level")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const vip = getVIPStatus(user.free_balance, user.miner_level);
    const ticketPrice = getLotteryTicketPrice(vip);
    const totalCost = ticketPrice * count;

    if (user.free_balance < totalCost) {
      return NextResponse.json({ error: `Insufficient balance. Need ${totalCost} FREE` }, { status: 400 });
    }

    // Get or create current draw
    const now = new Date();
    const { data: currentDraw } = await supabase
      .from("lottery_draws")
      .select("*")
      .eq("status", "upcoming")
      .order("draw_date", { ascending: false })
      .limit(1)
      .single();

    let drawId: number;
    if (!currentDraw) {
      // Create new draw
      const { data: newDraw } = await supabase
        .from("lottery_draws")
        .insert([{
          draw_date: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
          prize_pool: 50000,
          ticket_price: ticketPrice,
          total_tickets: 0,
          status: "upcoming"
        }])
        .select()
        .single();

      if (!newDraw) {
        return NextResponse.json({ error: "Failed to create draw" }, { status: 500 });
      }
      drawId = newDraw.id;
    } else {
      drawId = currentDraw.id;
    }

    // Deduct cost
    await supabase
      .from("users")
      .update({ free_balance: user.free_balance - totalCost })
      .eq("telegram_id", auth.telegramId);

    // Generate and add tickets
    const tickets = [];
    for (let i = 0; i < count; i++) {
      const ticketNumber = generateTicketNumber();
      tickets.push({
        draw_id: drawId,
        telegram_id: auth.telegramId,
        ticket_number: ticketNumber
      });
    }

    await supabase.from("lottery_tickets").insert(tickets);

    // Update draw stats
    await supabase
      .from("lottery_draws")
      .update({ 
        total_tickets: supabase.rpc('increment', { amount: count }),
        prize_pool: supabase.rpc('increment', { amount: Math.floor(totalCost * 0.7) })
      })
      .eq("id", drawId);

    // Add transaction
    await supabase.from("transactions").insert([{
      telegram_id: auth.telegramId,
      type: "lottery",
      amount: -totalCost,
      description: `Bought ${count} lottery ticket(s)`
    }]);

    return NextResponse.json({ success: true, count, totalCost, drawId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to buy tickets";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
