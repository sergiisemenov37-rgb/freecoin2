import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin();

    const { data: proposals, error } = await supabase
      .from("vote_proposals")
      .select("*")
      .in("status", ["active", "passed", "rejected"])
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ proposals });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load proposals";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
