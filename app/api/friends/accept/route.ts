import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { requestId: string } = await req.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get the friend request
    const { data: friendRequest, error: fetchError } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("id", requestId)
      .eq("to_telegram_id", auth.telegramId)
      .eq("status", "pending")
      .single();

    if (fetchError || !friendRequest) {
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 }
      );
    }

    // Update request status
    await supabase
      .from("friend_requests")
      .update({ status: "accepted" })
      .eq("id", requestId);

    // Add to friends table (both directions)
    await supabase.from("friends").insert([
      {
        telegram_id: auth.telegramId,
        friend_telegram_id: friendRequest.from_telegram_id,
        status: "accepted",
      },
      {
        telegram_id: friendRequest.from_telegram_id,
        friend_telegram_id: auth.telegramId,
        status: "accepted",
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to accept friend request";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}