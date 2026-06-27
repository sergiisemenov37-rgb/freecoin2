import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin();

    const { data: guilds, error } = await supabase
      .from("guilds")
      .select(`
        *,
        guild_members(count)
      `)
      .order("total_balance", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ guilds });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load guilds";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
