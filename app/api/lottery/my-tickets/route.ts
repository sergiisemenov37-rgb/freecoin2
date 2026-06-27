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

    // Get user's tickets
    const { data: tickets, error } = await supabase
      .from("lottery_tickets")
      .select(`
        *,
        lottery_draws (*)
      `)
      .eq("telegram_id", auth.telegramId)
      .order("purchased_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tickets });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load tickets";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
