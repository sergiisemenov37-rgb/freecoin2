import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { amount: number } = await req.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get user's guild
    const { data: member, error: memberError } = await supabase
      .from("guild_members")
      .select("guild_id")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (memberError || !member) {
      return NextResponse.json({ error: "You are not in a guild" }, { status: 400 });
    }

    // Get user balance
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("free_balance")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (userError || !user || user.free_balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Deduct from user
    await supabase
      .from("users")
      .update({ free_balance: user.free_balance - amount })
      .eq("telegram_id", auth.telegramId);

    // Add to guild balance
    await supabase
      .from("guilds")
      .update({ total_balance: supabase.raw(`total_balance + ${amount}`) })
      .eq("id", member.guild_id);

    // Record donation
    await supabase.from("guild_donations").insert({
      guild_id: member.guild_id,
      telegram_id: auth.telegramId,
      amount
    });

    // Update member contribution
    await supabase
      .from("guild_members")
      .update({ contribution: supabase.raw(`contribution + ${amount}`) })
      .eq("telegram_id", auth.telegramId);

    // Record transaction
    await supabase.from("transactions").insert({
      telegram_id: auth.telegramId,
      type: "guild_donation",
      amount: -amount,
      description: `Donated ${amount} FREE to guild`
    });

    return NextResponse.json({ success: true, message: "Donation successful" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to donate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
