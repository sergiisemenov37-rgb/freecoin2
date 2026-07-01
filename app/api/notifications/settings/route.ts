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

    const { data: settings, error } = await supabase
      .from("users")
      .select("notification_settings")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }

    return NextResponse.json({ 
      settings: settings?.notification_settings || {
        achievements: true,
        rewards: true,
        guild: true,
        events: true,
        referrals: true,
        reminders: true
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { settings: Record<string, boolean> } = await req.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json({ error: "Settings are required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("users")
      .update({ notification_settings: settings })
      .eq("telegram_id", auth.telegramId);

    if (error) {
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
