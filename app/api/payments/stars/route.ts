import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { 
      productId: string; 
      stars: number; 
      telegramPaymentId: string 
    } = await req.json();
    
    const { productId, stars, telegramPaymentId } = body;

    if (!productId || !stars || !telegramPaymentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Check if payment already processed
    const { data: existingPayment } = await supabase
      .from("star_payments")
      .select("*")
      .eq("telegram_payment_id", telegramPaymentId)
      .single();

    if (existingPayment) {
      return NextResponse.json({ error: "Payment already processed" }, { status: 400 });
    }

    // Get product details
    const rewards: Record<string, { free: number; badge?: string; effect?: any }> = {
      'stars_starter_pack': { free: 1000, effect: { type: 'mining_boost', value: 0.5, duration: 3600 } },
      'stars_premium_pack': { free: 5000, badge: 'premium_supporter' },
      'stars_mega_pack': { free: 15000, badge: 'mega_whale' }
    };

    const reward = rewards[productId];
    if (!reward) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    // Record payment
    await supabase.from("star_payments").insert({
      telegram_id: auth.telegramId,
      telegram_payment_id: telegramPaymentId,
      product_id: productId,
      stars,
      reward_free: reward.free,
      created_at: new Date().toISOString()
    });

    // Update user balance
    await supabase
      .from("users")
      .update({ free_balance: supabase.raw(`free_balance + ${reward.free}`) })
      .eq("telegram_id", auth.telegramId);

    // Add badge if applicable
    if (reward.badge) {
      await supabase.from("user_achievements").insert({
        telegram_id: auth.telegramId,
        achievement_id: reward.badge,
        unlocked_at: new Date().toISOString()
      });
    }

    // Record transaction
    await supabase.from("transactions").insert({
      telegram_id: auth.telegramId,
      type: "stars_purchase",
      amount: reward.free,
      description: `Purchased ${productId} with ${stars} stars`
    });

    return NextResponse.json({ 
      success: true, 
      reward: reward.free,
      message: `Successfully purchased! You received ${reward.free} FREE`
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
