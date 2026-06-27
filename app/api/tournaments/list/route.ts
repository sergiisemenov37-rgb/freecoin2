import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin();

    const { data: tournaments, error } = await supabase
      .from("tournaments")
      .select("*")
      .in("status", ["upcoming", "active"])
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tournaments });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load tournaments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
