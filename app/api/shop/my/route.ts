import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { shopItems } from "../../../../lib/shop";

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = getSupabaseAdmin();

    // Get user's purchases
    const { data: purchases, error } = await supabase
      .from("user_purchases")
      .select("*")
      .eq("telegram_id", auth.telegramId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get item details for purchases
    const ownedItems = purchases?.map(purchase => {
      const item = shopItems.find(i => i.id === purchase.item_id);
      return item ? { ...item, purchased_at: purchase.purchased_at } : null;
    }).filter(Boolean);

    return NextResponse.json({ items: ownedItems });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load purchases";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
