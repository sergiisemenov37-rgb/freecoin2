import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = getSupabaseAdmin();

    // Get pending friend requests
    const { data: requests, error } = await supabase
      .from("friend_requests")
      .select(`
        id,
        from_telegram_id,
        created_at,
        users!friend_requests_from_telegram_id_fkey (
          telegram_id,
          first_name,
          username
        )
      `)
      .eq("to_telegram_id", auth.telegramId)
      .eq("status", "pending");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ requests });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load friend requests";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
