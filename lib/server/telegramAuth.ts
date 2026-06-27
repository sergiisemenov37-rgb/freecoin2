import crypto from "crypto";

import type { TelegramUser } from "../types/user";

export type ValidatedTelegramAuth = {
  user: TelegramUser;
  telegramId: string;
};

export function validateTelegramInitData(
  initData: string
): ValidatedTelegramAuth | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || !initData) {
    return null;
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) {
    return null;
  }

  params.delete("hash");

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash !== hash) {
    return null;
  }

  const authDate = Number(params.get("auth_date") ?? 0);
  const maxAge = Number(process.env.TELEGRAM_INIT_DATA_MAX_AGE ?? 86_400);

  if (!authDate || Date.now() / 1000 - authDate > maxAge) {
    return null;
  }

  const userJson = params.get("user");
  if (!userJson) {
    return null;
  }

  try {
    const user = JSON.parse(userJson) as TelegramUser;
    if (!user?.id) {
      return null;
    }

    return {
      user,
      telegramId: user.id.toString(),
    };
  } catch {
    return null;
  }
}
