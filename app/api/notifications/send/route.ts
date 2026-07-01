import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { sendTelegramPushNotification } from "../../../../lib/notifications";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { message: string; type?: 'achievement' | 'reward' | 'guild' | 'event' | 'referral' } = await req.json();
    const { message, type } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get user's Telegram chat ID
    const chatId = auth.telegramId.toString();

    const success = await sendTelegramPushNotification(chatId, message);

    if (success) {
      return NextResponse.json({ success: true, message: "Notification sent" });
    } else {
      return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send notification";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
