import { NextResponse } from "next/server";

import type { TelegramUser } from "../types/user";
import { validateTelegramInitData } from "./telegramAuth";

type AuthFailure = {
  ok: false;
  response: NextResponse;
};

type AuthSuccess = {
  ok: true;
  telegramId: string;
};

export async function authenticateRequest(
  request: Request
): Promise<AuthSuccess | AuthFailure> {
  let initData: string | undefined;

  try {
    const body = await request.json();
    initData = body?.initData;
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      ),
    };
  }

  if (!initData) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Missing initData" },
        { status: 401 }
      ),
    };
  }

  const auth = validateTelegramInitData(initData);

  if (!auth) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid Telegram auth" },
        { status: 401 }
      ),
    };
  }

  return {
    ok: true,
    telegramId: auth.telegramId,
  };
}

export async function authenticateRegisterRequest(
  request: Request
): Promise<
  | AuthFailure
  | {
      ok: true;
      telegramId: string;
      user: TelegramUser;
      referrerId: string | null;
    }
> {
  let initData: string | undefined;
  let referrerId: string | null = null;

  try {
    const body = await request.json();
    initData = body?.initData;
    referrerId =
      typeof body?.referrerId === "string" ? body.referrerId : null;
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      ),
    };
  }

  if (!initData) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Missing initData" },
        { status: 401 }
      ),
    };
  }

  const auth = validateTelegramInitData(initData);

  if (!auth) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid Telegram auth" },
        { status: 401 }
      ),
    };
  }

  return {
    ok: true,
    telegramId: auth.telegramId,
    user: auth.user,
    referrerId,
  };
}
