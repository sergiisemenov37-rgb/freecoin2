import type { AppUser, TelegramUser } from "../types/user";
import { getSupabaseAdmin } from "./supabaseAdmin";

export async function ensureUserRegistered(
  telegramUser: TelegramUser,
  referrerId: string | null
): Promise<AppUser | null> {
  const supabase = getSupabaseAdmin();
  const telegramId = telegramUser.id.toString();

  await supabase.from("telegram_users").upsert(
    {
      telegram_id: telegramId,
      username: telegramUser.username || "",
      first_name: telegramUser.first_name || "",
    },
    { onConflict: "telegram_id" }
  );

  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (existingUser) {
    return existingUser as AppUser;
  }

  const wallet = `tg_${telegramUser.id}`;
  const safeReferrer =
    referrerId && referrerId !== telegramId ? referrerId : null;

  const { error: insertError } = await supabase.from("users").insert([
    {
      telegram_id: telegramId,
      wallet,
      referred_by: safeReferrer,
      free_balance: 0,
      tasks_completed: 0,
      miner_level: 1,
      miner_power: 0.2,
      banned: false,
    },
  ]);

  if (insertError) {
    throw new Error("Failed to register user");
  }

  if (safeReferrer) {
    const { data: referrer } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", safeReferrer)
      .single();

    if (referrer) {
      await supabase
        .from("users")
        .update({
          free_balance: (referrer.free_balance || 0) + 50,
        })
        .eq("telegram_id", safeReferrer);

      await supabase.from("referrals").insert([
        {
          referrer_id: safeReferrer,
          invited_id: telegramId,
          reward: 50,
        },
      ]);

      await supabase.from("transactions").insert([
        {
          telegram_id: safeReferrer,
          type: "referral",
          amount: 50,
          description: "Referral reward",
        },
      ]);
    }
  }

  const { data: newUser } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  return (newUser as AppUser) ?? null;
}
