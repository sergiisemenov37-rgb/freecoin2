import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get user's guild
    const { data: user } = await supabase
      .from("users")
      .select("guild_id")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (!user || !user.guild_id) {
      return NextResponse.json({ error: "Not in a guild" }, { status: 403 });
    }

    // Send guild message
    const { error } = await supabase
      .from("guild_messages")
      .insert([{
        guild_id: parseInt(user.guild_id),
        from_telegram_id: auth.telegramId,
        content,
        type: "text"
      }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Message sent" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
