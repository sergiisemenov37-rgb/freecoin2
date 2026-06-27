import type { AppUser, UpgradeResult } from "../types/user";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { getLevelInfo, getNextLevel, getMaxLevel } from "../miningLevels";

const MAX_OFFLINE_MINING_SECONDS = 86_400;

export async function updateMining(
  telegramId: string
): Promise<AppUser | null> {
  const supabase = getSupabaseAdmin();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (!user) {
    return null;
  }

  if (user.banned) {
    throw new Error("Account banned");
  }

  const now = new Date();
  const lastMining = new Date(user.last_mining || now.toISOString());

  const diffSeconds = Math.min(
    Math.floor((now.getTime() - lastMining.getTime()) / 1000),
    MAX_OFFLINE_MINING_SECONDS
  );

  if (diffSeconds <= 0) {
    return user as AppUser;
  }

  const power = Number(user.miner_power || 0.2);
  const reward = (power / 60) * diffSeconds;
  const newBalance = Number(user.free_balance || 0) + reward;

  const { data: updated, error } = await supabase
    .from("users")
    .update({
      free_balance: newBalance,
      last_mining: now.toISOString(),
    })
    .eq("telegram_id", telegramId)
    .select("*")
    .single();

  if (error || !updated) {
    throw new Error("Failed to update mining balance");
  }

  return updated as AppUser;
}

export async function upgradeMiner(
  telegramId: string
): Promise<UpgradeResult> {
  const supabase = getSupabaseAdmin();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (!user) {
    return { success: false, error: "User not found" };
  }

  if (user.banned) {
    return { success: false, error: "Account banned" };
  }

  const level = Number(user.miner_level || 1);
  const balance = Number(user.free_balance || 0);

  // Проверка на максимальный уровень
  if (level >= getMaxLevel()) {
    return { success: false, error: "Maximum level reached" };
  }

  const currentLevelInfo = getLevelInfo(level);
  const nextLevelInfo = getNextLevel(level);

  if (!nextLevelInfo) {
    return { success: false, error: "Maximum level reached" };
  }

  const price = nextLevelInfo.price;

  if (balance < price) {
    return { success: false, error: "Not enough FREE" };
  }

  const newLevel = nextLevelInfo.level;
  const newPower = nextLevelInfo.power;
  const newBalance = balance - price;

  const { error: updateError } = await supabase
    .from("users")
    .update({
      miner_level: newLevel,
      miner_power: newPower,
      free_balance: newBalance,
    })
    .eq("telegram_id", telegramId);

  if (updateError) {
    return { success: false, error: "Upgrade failed" };
  }

  await supabase.from("transactions").insert([
    {
      telegram_id: telegramId,
      type: "upgrade",
      amount: -price,
      description: `Miner upgraded to ${nextLevelInfo.name}`,
    },
  ]);

  return {
    success: true,
    level: newLevel,
    power: newPower,
    balance: newBalance,
  };
}
