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

    // Get user's tournaments
    const { data: participants, error } = await supabase
      .from("tournament_participants")
      .select(`
        *,
        tournaments (*)
      `)
      .eq("telegram_id", auth.telegramId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tournaments: participants });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load tournaments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
