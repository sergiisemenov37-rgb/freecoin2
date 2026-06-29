import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { samplePromoCodes, validatePromoCode, applyPromoCode } from "../../../../lib/promoCodes";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { code: string } = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Validate promo code (using sample codes for now)
    const promo = validatePromoCode(code, samplePromoCodes);
    if (!promo) {
      return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 400 });
    }

    // Check if already used
    const { data: existingUse } = await supabase
      .from("user_promo_uses")
      .select("*")
      .eq("telegram_id", auth.telegramId)
      .eq("promo_code_id", samplePromoCodes.indexOf(promo) + 1)
      .single();

    if (existingUse) {
      return NextResponse.json({ error: "Promo code already used" }, { status: 400 });
    }

    // Apply promo code
    const result = applyPromoCode(promo, auth.telegramId);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Add reward to balance if applicable
    if (result.type === 'balance') {
      await supabase
        .from("users")
        .update({ free_balance: supabase.rpc('increment', { amount: result.reward }) })
        .eq("telegram_id", auth.telegramId);

      await supabase.from("transactions").insert([{
        telegram_id: auth.telegramId,
        type: "promo",
        amount: result.reward,
        description: `Promo code: ${code}`
      }]);
    }

    // Record usage
    await supabase.from("user_promo_uses").insert([{
      telegram_id: auth.telegramId,
      promo_code_id: samplePromoCodes.indexOf(promo) + 1
    }]);

    return NextResponse.json({ success: true, reward: result.reward, type: result.type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to redeem promo code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
