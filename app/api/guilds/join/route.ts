import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { GUILD_JOIN_COST } from "../../../../lib/guilds";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json();
    const { guildId } = body;

    if (!guildId) {
      return NextResponse.json({ error: "Guild ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Check user balance and guild status
    const { data: user } = await supabase
      .from("users")
      .select("guild_id, free_balance, miner_level")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.guild_id) {
      return NextResponse.json({ error: "Already in a guild" }, { status: 400 });
    }

    if (user.free_balance < GUILD_JOIN_COST) {
      return NextResponse.json({ error: `Insufficient balance. Need ${GUILD_JOIN_COST} FREE` }, { status: 400 });
    }

    // Get guild details
    const { data: guild } = await supabase
      .from("guilds")
      .select("*")
      .eq("id", guildId)
      .single();

    if (!guild) {
      return NextResponse.json({ error: "Guild not found" }, { status: 404 });
    }

    // Check if user can join (level requirement, member limit)
    const bonus = await import("../../../../lib/guilds").then(m => m.getGuildBonus(guild.level));
    const { count: memberCount } = await supabase
      .from("guild_members")
      .select("*", { count: 'exact', head: true })
      .eq("guild_id", guildId);

    const currentMembers = memberCount ?? 0;
    if (currentMembers >= bonus.maxMembers) {
      return NextResponse.json({ error: "Guild is full" }, { status: 400 });
    }

    // Deduct cost
    await supabase
      .from("users")
      .update({ free_balance: user.free_balance - GUILD_JOIN_COST, guild_id: guildId.toString() })
      .eq("telegram_id", auth.telegramId);

    // Add as guild member
    await supabase.from("guild_members").insert([{
      guild_id: guildId,
      telegram_id: auth.telegramId,
      role: "member",
      contribution: user.miner_level * 100
    }]);

    // Update guild stats
    await supabase
      .from("guilds")
      .update({
        total_power: guild.total_power + user.miner_level * 100,
        total_balance: guild.total_balance + user.free_balance
      })
      .eq("id", guildId);

    // Add transaction
    await supabase.from("transactions").insert([{
      telegram_id: auth.telegramId,
      type: "guild",
      amount: -GUILD_JOIN_COST,
      description: `Joined guild: ${guild.name}`
    }]);

    return NextResponse.json({ success: true, guild });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to join guild";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
