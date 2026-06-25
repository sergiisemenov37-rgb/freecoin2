"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ReferralsPage() {
const [count, setCount] =
useState(0);

const [telegramId, setTelegramId] =
useState("");

useEffect(() => {
loadReferrals();
}, []);

async function loadReferrals() {
const tg =
(window as any)
?.Telegram
?.WebApp;

const user =
  tg?.initDataUnsafe?.user;

if (!user) return;

setTelegramId(
  user.id.toString()
);

const { data } =
  await supabase
    .from("referrals")
    .select("*")
    .eq(
      "referrer_id",
      user.id.toString()
    );

setCount(data?.length || 0);

}

return (
<main className="min-h-screen bg-black text-white p-6">

  <h1 className="text-5xl font-bold mb-10">
    👥 Referrals
  </h1>

  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

    <p className="mb-4">
      Your Referral Link
    </p>

    <p className="text-blue-400 break-all">
      https://freecoin.app/?ref={telegramId}
    </p>

    <div className="mt-10">

      <p className="text-5xl font-bold text-green-400">
        {count}
      </p>

      <p className="text-zinc-400">
        Referrals
      </p>

    </div>

  </div>

</main>

);
}