"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
const [user, setUser] =
useState<any>(null);

useEffect(() => {
loadProfile();
}, []);

async function loadProfile() {
const tg =
(window as any)
?.Telegram
?.WebApp;

const telegramUser =
  tg?.initDataUnsafe?.user;

if (!telegramUser) return;

const { data } =
  await supabase
    .from("users")
    .select("*")
    .eq(
      "telegram_id",
      telegramUser.id.toString()
    )
    .single();

setUser(data);

}

return (
<main className="min-h-screen bg-black text-white p-6">

  <h1 className="text-5xl font-bold mb-10">
    👤 Profile
  </h1>

  <div className="grid gap-6 max-w-3xl">

    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

      <p className="text-zinc-400">
        FREE Balance
      </p>

      <p className="text-5xl font-bold text-green-400">
        {user?.free_balance || 0}
      </p>

    </div>

    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

      <p className="text-zinc-400">
        Tasks Completed
      </p>

      <p className="text-5xl font-bold text-yellow-400">
        {user?.tasks_completed || 0}
      </p>

    </div>

  </div>

</main>

);
}