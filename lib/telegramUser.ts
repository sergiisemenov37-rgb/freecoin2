import type { TelegramUser } from "./types/user";

export type { AppUser, TelegramUser } from "./types/user";

type TelegramWebApp = {
  ready: () => void;
  initData?: string;
  initDataUnsafe?: { user?: TelegramUser };
  version?: string;
  platform?: string;
};

function getWebApp(): TelegramWebApp | null {
  // Check if running in Telegram WebApp
  const isTelegram = window.Telegram?.WebApp || 
                     (window as any).TelegramWebviewProxy ||
                     window.location.href.includes('t.me') ||
                     window.location.href.includes('telegram');
  
  if (!isTelegram) {
    console.log('Not in Telegram environment');
    return null;
  }

  const tg = (window as typeof window & {
    Telegram?: { WebApp?: TelegramWebApp };
    TelegramWebviewProxy?: any;
  }).Telegram?.WebApp ?? (window as any).TelegramWebviewProxy;

  if (!tg) {
    console.log('Telegram WebApp not found');
    return null;
  }

  console.log('Telegram WebApp found:', { version: tg.version, platform: tg.platform });
  return tg;
}

export function getTelegramUser(): TelegramUser | null {
  const tg = getWebApp();
  if (!tg) return null;

  tg.ready();
  const user = tg.initDataUnsafe?.user;
  console.log('Telegram user:', user);
  return user ?? null;
}

export function getTelegramInitData(): string | null {
  const tg = getWebApp();
  if (!tg) return null;

  tg.ready();
  const initData = tg.initData;
  console.log('Telegram initData:', initData ? 'present' : 'missing');
  return initData ?? null;
}
