import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const friendTelegramId = searchParams.get("friend");

    if (!friendTelegramId) {
      return NextResponse.json({ error: "Friend Telegram ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get messages between users
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(from_telegram_id.eq.${auth.telegramId},to_telegram_id.eq.${friendTelegramId}),and(from_telegram_id.eq.${friendTelegramId},to_telegram_id.eq.${auth.telegramId})`)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("to_telegram_id", auth.telegramId)
      .eq("from_telegram_id", friendTelegramId);

    return NextResponse.json({ messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load messages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
