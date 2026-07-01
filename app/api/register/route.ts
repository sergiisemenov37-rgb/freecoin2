import { NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/server/apiAuth";
import { ensureUserRegistered } from "@/lib/server/userService";
import { TelegramUser } from "@/lib/types/user";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    // Parse Telegram user from request
    const url = new URL(req.url);
    const initData = url.searchParams.get('initData') || 
                     (await (req as any).json?.().then((b: any) => b.initData).catch(() => null));

    if (!initData) {
      return NextResponse.json({ error: 'Missing initData' }, { status: 401 });
    }

    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    
    if (!userStr) {
      return NextResponse.json({ error: 'Invalid telegram data' }, { status: 401 });
    }

    const telegramUser = JSON.parse(userStr) as TelegramUser;
    
    // Get referrer from URL or body
    const urlParams = new URL(req.url);
    const referrerId = urlParams.searchParams.get('ref') || 
                      (await (req as any).json?.().then((b: any) => b.referrerId).catch(() => null));

    const user = await ensureUserRegistered(telegramUser, referrerId);

    if (!user) {
      return NextResponse.json(
        { error: "Failed to register user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
