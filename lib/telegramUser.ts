import type { TelegramUser } from "./types/user";

export type { AppUser, TelegramUser } from "./types/user";

type TelegramWebApp = {
  ready: () => void;
  initData?: string;
  initDataUnsafe?: { user?: TelegramUser };
};

function getWebApp(): TelegramWebApp | null {
  return (
    window as typeof window & {
      Telegram?: { WebApp?: TelegramWebApp };
    }
  ).Telegram?.WebApp ?? null;
}

export function getTelegramUser(): TelegramUser | null {
  const tg = getWebApp();
  if (!tg) return null;

  tg.ready();
  return tg.initDataUnsafe?.user ?? null;
}

export function getTelegramInitData(): string | null {
  const tg = getWebApp();
  if (!tg) return null;

  tg.ready();
  return tg.initData ?? null;
}
