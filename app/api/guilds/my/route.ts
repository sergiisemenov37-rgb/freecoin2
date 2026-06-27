import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = getSupabaseAdmin();

    // Get user's guild
    const { data: user } = await supabase
      .from("users")
      .select("guild_id")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (!user || !user.guild_id) {
      return NextResponse.json({ guild: null });
    }

    // Get guild details with members
    const { data: guild, error } = await supabase
      .from("guilds")
      .select(`
        *,
        guild_members (
          telegram_id,
          role,
          contribution,
          users (
            telegram_id,
            first_name,
            username
          )
        )
      `)
      .eq("id", parseInt(user.guild_id))
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ guild });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load guild";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
