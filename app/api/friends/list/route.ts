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

    // Get friends with user details
    const { data: friends, error } = await supabase
      .from("friends")
      .select(`
        friend_telegram_id,
        status,
        created_at,
        users!friends_friend_telegram_id_fkey (
          telegram_id,
          first_name,
          username
        )
      `)
      .eq("telegram_id", auth.telegramId)
      .eq("status", "accepted");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ friends });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load friends";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
