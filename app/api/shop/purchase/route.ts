import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { shopItems } from "../../../../lib/shop";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { itemId: string } = await req.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get item details
    const item = shopItems.find(i => i.id === itemId);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Check if already owned
    const { data: existingPurchase } = await supabase
      .from("user_purchases")
      .select("*")
      .eq("telegram_id", auth.telegramId)
      .eq("item_id", itemId)
      .single();

    if (existingPurchase) {
      return NextResponse.json({ error: "Already owned" }, { status: 400 });
    }

    // Get user balance
    const { data: user } = await supabase
      .from("users")
      .select("free_balance")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (!user || user.free_balance < item.price) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Deduct price
    await supabase
      .from("users")
      .update({ free_balance: user.free_balance - item.price })
      .eq("telegram_id", auth.telegramId);

    // Add purchase record
    await supabase.from("user_purchases").insert([{
      telegram_id: auth.telegramId,
      item_id: itemId,
      item_type: item.type,
      price: item.price
    }]);

    // Add transaction
    await supabase.from("transactions").insert([{
      telegram_id: auth.telegramId,
      type: "purchase",
      amount: -item.price,
      description: `Purchased: ${item.name}`
    }]);

    return NextResponse.json({ success: true, item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to purchase item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
