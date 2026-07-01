import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { getGuildLevelUpCost, getGuildExperienceForLevel } from "../../../../lib/guilds";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = getSupabaseAdmin();

    // Get user's guild
    const { data: member, error: memberError } = await supabase
      .from("guild_members")
      .select("guild_id, role")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (memberError || !member) {
      return NextResponse.json({ error: "You are not in a guild" }, { status: 400 });
    }

    if (member.role !== 'leader') {
      return NextResponse.json({ error: "Only guild leaders can level up the guild" }, { status: 403 });
    }

    // Get guild data
    const { data: guild, error: guildError } = await supabase
      .from("guilds")
      .select("*")
      .eq("id", member.guild_id)
      .single();

    if (guildError || !guild) {
      return NextResponse.json({ error: "Guild not found" }, { status: 404 });
    }

    const requiredExp = getGuildExperienceForLevel(guild.level + 1);
    const cost = getGuildLevelUpCost(guild.level);

    if (guild.experience < requiredExp) {
      return NextResponse.json({ error: `Need ${requiredExp} experience to level up` }, { status: 400 });
    }

    if (guild.total_balance < cost) {
      return NextResponse.json({ error: `Need ${cost} FREE in guild bank to level up` }, { status: 400 });
    }

    // Level up guild
    await supabase
      .from("guilds")
      .update({
        level: guild.level + 1,
        total_balance: guild.total_balance - cost,
        experience: guild.experience - requiredExp
      })
      .eq("id", guild.id);

    return NextResponse.json({ 
      success: true, 
      message: `Guild leveled up to ${guild.level + 1}!`,
      newLevel: guild.level + 1
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to level up guild";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
