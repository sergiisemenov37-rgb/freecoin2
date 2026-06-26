"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import ASICMiner from "../components/ASICMiner";
import MiningStats from "../components/MiningStats";
import MiningProgress from "../components/MiningProgress";
import UpgradeCard from "../components/UpgradeCard";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [completed, setCompleted] = useState(0);

  const [minerLevel, setMinerLevel] = useState(1);
  const [minerPower, setMinerPower] = useState(0.2);

  const [name, setName] = useState("User");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const ref = params.get("ref");

    if (ref) {
      localStorage.setItem("ref", ref);
    }

    loadUser();
  }, []);

  async function loadUser() {
    const tg = (window as any)?.Telegram?.WebApp;

    const telegramUser =
      tg?.initDataUnsafe?.user;

    if (!telegramUser) return;

    setName(
      telegramUser.first_name || "User"
    );

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq(
        "telegram_id",
        telegramUser.id.toString()
      )
      .single();

    if (!data) return;

    setBalance(data.free_balance || 0);

    setCompleted(
      data.tasks_completed || 0
    );

    setMinerLevel(
      data.miner_level || 1
    );

    setMinerPower(
      data.miner_power || 0.2
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-3xl mx-auto p-6">

        <h1 className="text-5xl font-bold text-green-400 text-center">
          FREECOIN
        </h1>

        <p className="text-center text-zinc-500 mt-2 mb-8">
          Telegram Web3 Mining Platform
        </p>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-8">

          <h2 className="text-3xl font-bold">
            👋 {name}
          </h2>

          <p className="text-zinc-500 mt-2">
            Welcome back Miner
          </p>

        </div>

        <MiningStats
          balance={balance}
          power={minerPower}
        />

        <ASICMiner />

        <MiningProgress />

        <UpgradeCard
          level={minerLevel}
          power={minerPower}
        />

        <div className="mt-8">

          <a
            href="/tasks"
            className="block w-full bg-green-600 hover:bg-green-500 rounded-3xl py-5 text-center text-xl font-bold"
          >
            🚀 Start Earning
          </a>

        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 text-center">

            <p className="text-zinc-500">
              Tasks Completed
            </p>

            <p className="text-3xl font-bold text-yellow-400 mt-2">
              {completed}
            </p>

          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 text-center">

            <p className="text-zinc-500">
              Miner Level
            </p>

            <p className="text-3xl font-bold text-green-400 mt-2">
              LVL {minerLevel}
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}