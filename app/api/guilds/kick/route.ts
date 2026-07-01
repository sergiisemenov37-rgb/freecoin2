import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { memberId: string } = await req.json();
    const { memberId } = body;

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get user's guild and role
    const { data: caller, error: callerError } = await supabase
      .from("guild_members")
      .select("guild_id, role")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (callerError || !caller) {
      return NextResponse.json({ error: "You are not in a guild" }, { status: 400 });
    }

    if (caller.role !== 'leader' && caller.role !== 'officer') {
      return NextResponse.json({ error: "Only leaders and officers can kick members" }, { status: 403 });
    }

    // Get member to kick
    const { data: member, error: memberError } = await supabase
      .from("guild_members")
      .select("guild_id, role")
      .eq("id", memberId)
      .single();

    if (memberError || !member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (member.guild_id !== caller.guild_id) {
      return NextResponse.json({ error: "Member is not in your guild" }, { status: 400 });
    }

    if (member.role === 'leader') {
      return NextResponse.json({ error: "Cannot kick the guild leader" }, { status: 400 });
    }

    if (caller.role === 'officer' && member.role === 'officer') {
      return NextResponse.json({ error: "Officers cannot kick other officers" }, { status: 403 });
    }

    // Remove member
    await supabase
      .from("guild_members")
      .delete()
      .eq("id", memberId);

    return NextResponse.json({ success: true, message: "Member kicked successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to kick member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
