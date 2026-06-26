"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
const [balance, setBalance] =
useState(0);

const [completed, setCompleted] =
useState(0);

const [name, setName] =
useState("User");

useEffect(() => {

const params =
  new URLSearchParams(
    window.location.search
  );

const ref =
  params.get("ref");

if (ref) {
  localStorage.setItem(
    "ref",
    ref
  );
}

loadUser();

}, []);

async function loadUser() {

const tg =
  (window as any)
    ?.Telegram
    ?.WebApp;

const telegramUser =
  tg?.initDataUnsafe?.user;

if (!telegramUser)
  return;

setName(
  telegramUser.first_name ||
  "User"
);

const { data } =
  await supabase
    .from("users")
    .select("*")
    .eq(
      "telegram_id",
      telegramUser.id.toString()
    )
    .single();

if (data) {

  setBalance(
    data.free_balance || 0
  );

  setCompleted(
    data.tasks_completed || 0
  );

}

}

return (
<main className="min-h-screen bg-black text-white">

  <div className="p-6">

    <h1 className="text-5xl font-bold text-green-400 mb-3">
      FREECOIN
    </h1>

    <p className="text-zinc-400 mb-10">
      Telegram Reward Platform
    </p>

    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-6">

      <h2 className="text-3xl font-bold mb-2">
        👋 {name}
      </h2>

      <p className="text-zinc-500">
        Welcome back
      </p>

    </div>

    <div className="grid grid-cols-2 gap-4 mb-8">

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

        <p className="text-zinc-500 mb-2">
          FREE Balance
        </p>

        <p className="text-4xl font-bold text-green-400">
          {balance}
        </p>

      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

        <p className="text-zinc-500 mb-2">
          Tasks Completed
        </p>

        <p className="text-4xl font-bold text-yellow-400">
          {completed}
        </p>

      </div>

    </div>

    <a
      href="/tasks"
      className="block text-center bg-green-600 hover:bg-green-500 rounded-3xl p-5 text-xl font-bold mb-4"
    >
      🚀 Start Earning
    </a>

    <a
      href="/history"
      className="block text-center bg-zinc-900 border border-zinc-700 rounded-3xl p-5 text-xl font-bold"
    >
      📜 History
    </a>

  </div>

</main>

);
}