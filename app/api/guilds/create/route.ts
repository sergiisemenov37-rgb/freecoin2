import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { GUILD_CREATE_COST } from "../../../../lib/guilds";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json();
    const { name, description, emblem } = body;

    if (!name || !emblem) {
      return NextResponse.json({ error: "Name and emblem are required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Check if user already in a guild
    const { data: user } = await supabase
      .from("users")
      .select("guild_id, free_balance")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.guild_id) {
      return NextResponse.json({ error: "Already in a guild" }, { status: 400 });
    }

    if (user.free_balance < GUILD_CREATE_COST) {
      return NextResponse.json({ error: `Insufficient balance. Need ${GUILD_CREATE_COST} FREE` }, { status: 400 });
    }

    // Create guild
    const { data: guild, error: guildError } = await supabase
      .from("guilds")
      .insert([{
        name,
        description: description || "",
        emblem,
        leader_id: auth.telegramId,
        level: 1,
        total_power: 0,
        total_balance: 0
      }])
      .select()
      .single();

    if (guildError) {
      return NextResponse.json({ error: guildError.message }, { status: 500 });
    }

    // Deduct cost from user balance
    await supabase
      .from("users")
      .update({ free_balance: user.free_balance - GUILD_CREATE_COST, guild_id: guild.id.toString() })
      .eq("telegram_id", auth.telegramId);

    // Add user as guild member (leader)
    await supabase.from("guild_members").insert([{
      guild_id: guild.id,
      telegram_id: auth.telegramId,
      role: "leader",
      contribution: 0
    }]);

    // Add transaction record
    await supabase.from("transactions").insert([{
      telegram_id: auth.telegramId,
      type: "guild",
      amount: -GUILD_CREATE_COST,
      description: `Created guild: ${name}`
    }]);

    return NextResponse.json({ success: true, guild });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create guild";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
