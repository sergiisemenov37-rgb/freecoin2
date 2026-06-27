import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { canSendFriendRequest } from "../../../../lib/friends";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { friendTelegramId } = body;

    if (!friendTelegramId) {
      return NextResponse.json({ error: "Friend Telegram ID is required" }, { status: 400 });
    }

    if (friendTelegramId === auth.telegramId) {
      return NextResponse.json({ error: "Cannot add yourself as a friend" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Check if already friends
    const { data: existingFriend } = await supabase
      .from("friends")
      .select("*")
      .or(`telegram_id.eq.${auth.telegramId},friend_telegram_id.eq.${auth.telegramId}`)
      .or(`telegram_id.eq.${friendTelegramId},friend_telegram_id.eq.${friendTelegramId}`)
      .single();

    if (existingFriend) {
      return NextResponse.json({ error: "Already friends or request pending" }, { status: 400 });
    }

    // Check cooldown
    const { data: lastRequest } = await supabase
      .from("friend_requests")
      .select("created_at")
      .eq("from_telegram_id", auth.telegramId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (lastRequest && !canSendFriendRequest(lastRequest.created_at)) {
      return NextResponse.json({ error: "Please wait before sending another request" }, { status: 429 });
    }

    // Check if friend exists
    const { data: friendUser } = await supabase
      .from("users")
      .select("telegram_id")
      .eq("telegram_id", friendTelegramId)
      .single();

    if (!friendUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create friend request
    const { error: requestError } = await supabase
      .from("friend_requests")
      .insert([{
        from_telegram_id: auth.telegramId,
        to_telegram_id: friendTelegramId,
        status: "pending"
      }]);

    if (requestError) {
      return NextResponse.json({ error: requestError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Friend request sent" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send friend request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
