export type TelegramUser = {
  id: number;
  first_name?: string;
  username?: string;
};

export type AppUser = {
  telegram_id: string;
  wallet: string;
  free_balance: number;
  tasks_completed: number;
  miner_level: number;
  miner_power: number;
  last_mining?: string;
  banned?: boolean;
  referred_by?: string | null;
  // New fields for enhanced features
  streak?: number;
  last_streak_date?: string;
  guild_id?: string | null;
  reputation_score?: number;
  total_mined?: number;
  created_at?: string;
  vip_level?: number;
};

export type UpgradeResult =
  | { success: false; error: string }
  | {
      success: true;
      level: number;
      power: number;
      balance: number;
    };
