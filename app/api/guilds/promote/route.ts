import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { memberId: string; role: 'officer' | 'member' } = await req.json();
    const { memberId, role } = body;

    if (!memberId || !role) {
      return NextResponse.json({ error: "Member ID and role are required" }, { status: 400 });
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

    if (caller.role !== 'leader') {
      return NextResponse.json({ error: "Only guild leaders can promote members" }, { status: 403 });
    }

    // Get member to promote
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
      return NextResponse.json({ error: "Cannot change leader role" }, { status: 400 });
    }

    // Update member role
    await supabase
      .from("guild_members")
      .update({ role })
      .eq("id", memberId);

    return NextResponse.json({ success: true, message: `Member promoted to ${role}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to promote member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
