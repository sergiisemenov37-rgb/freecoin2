"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TelegramPage() {
const [user, setUser] =
useState<any>(null);

const [loading, setLoading] =
useState(true);

useEffect(() => {
initTelegram();
}, []);

async function initTelegram() {
try {
const tg =
(window as any)
?.Telegram
?.WebApp;

  if (!tg) {
    setLoading(false);
    return;
  }

  tg.ready();

  const telegramUser =
    tg.initDataUnsafe?.user;

  if (!telegramUser) {
    setLoading(false);
    return;
  }

  setUser(telegramUser);

  await supabase
    .from("telegram_users")
    .upsert(
      {
        telegram_id:
          telegramUser.id.toString(),

        username:
          telegramUser.username ||
          "",

        first_name:
          telegramUser.first_name ||
          "",
      },
      {
        onConflict:
          "telegram_id",
      }
    );

  const wallet =
    `tg_${telegramUser.id}`;

  const referrerId =
    localStorage.getItem("ref");

  const { data: existingUser } =
    await supabase
      .from("users")
      .select("*")
      .eq(
        "telegram_id",
        telegramUser.id.toString()
      )
      .single();

  if (!existingUser) {

    await supabase
      .from("users")
      .insert([
        {
          telegram_id:
            telegramUser.id.toString(),

          wallet,

          referred_by:
            referrerId || null,

          free_balance: 0,

          tasks_completed: 0,

          banned: false,
        },
      ]);

    if (
      referrerId &&
      referrerId !==
        telegramUser.id.toString()
    ) {

      const {
        data: referrer,
      } =
        await supabase
          .from("users")
          .select("*")
          .eq(
            "telegram_id",
            referrerId
          )
          .single();

      if (referrer) {

        await supabase
          .from("users")
          .update({
            free_balance:
              (referrer.free_balance || 0) +
              50,
          })
          .eq(
            "telegram_id",
            referrerId
          );

        await supabase
          .from("referrals")
          .insert([
            {
              referrer_id:
                referrerId,

              invited_id:
                telegramUser.id.toString(),

              reward: 50,
            },
          ]);

        await supabase
          .from("transactions")
          .insert([
            {
              telegram_id:
                referrerId,

              type:
                "referral",

              amount: 50,

              description:
                "Referral reward",
            },
          ]);
      }
    }
  }

  setLoading(false);

} catch (err) {
  console.error(err);
  setLoading(false);
}

}

return (
<main className="min-h-screen bg-black text-white p-6">

  <h1 className="text-5xl font-bold text-green-400 mb-10">
    📱 FREECOIN Telegram
  </h1>

  {loading && (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
      Loading...
    </div>
  )}

  {!loading && !user && (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

      <h2 className="text-2xl font-bold mb-4">
        Telegram not detected
      </h2>

      <p className="text-zinc-400">
        Open FREECOIN from Telegram Bot.
      </p>

    </div>
  )}

  {!loading && user && (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

      <h2 className="text-3xl font-bold mb-6">
        Welcome {user.first_name}
      </h2>

      <div className="space-y-3">

        <p>
          Telegram ID: {user.id}
        </p>

        <p>
          Username: @{user.username}
        </p>

      </div>

      <div className="mt-6 bg-green-950 border border-green-700 rounded-2xl p-4">
        ✅ User synced with Supabase
      </div>

    </div>
  )}

</main>

);
}