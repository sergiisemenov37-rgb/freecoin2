import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { toTelegramId, content } = body;

    if (!toTelegramId || !content) {
      return NextResponse.json({ error: "Recipient and content are required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Check if they are friends
    const { data: friendship } = await supabase
      .from("friends")
      .select("*")
      .or(`telegram_id.eq.${auth.telegramId},friend_telegram_id.eq.${auth.telegramId}`)
      .or(`telegram_id.eq.${toTelegramId},friend_telegram_id.eq.${toTelegramId}`)
      .eq("status", "accepted")
      .single();

    if (!friendship) {
      return NextResponse.json({ error: "Not friends with this user" }, { status: 403 });
    }

    // Send message
    const { error } = await supabase
      .from("messages")
      .insert([{
        from_telegram_id: auth.telegramId,
        to_telegram_id: toTelegramId,
        content,
        type: "text",
        read: false
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
