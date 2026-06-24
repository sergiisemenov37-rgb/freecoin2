"use client";

import { useEffect, useState } from "react";

import WalletButton from "../components/WalletButton";

import { supabase } from "../lib/supabase";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const wallet =
      localStorage.getItem("wallet");

    if (!wallet) return;

    let { data } = await supabase
      .from("users")
      .select("*")
      .eq("wallet", wallet)
      .single();

    if (!data) {
      const { data: newUser } =
        await supabase
          .from("users")
          .insert([
            {
              wallet,
            },
          ])
          .select()
          .single();

      data = newUser;
    }

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

      <div className="flex justify-between items-center p-4 border-b border-zinc-800">

        <h1 className="text-2xl font-bold text-green-400">
          FREECOIN
        </h1>

        <WalletButton />

      </div>

      <div className="p-6">

        <h2 className="text-4xl font-bold mb-2">
          👋 Welcome
        </h2>

        <p className="text-zinc-400 mb-8">
          Earn rewards for completing tasks
        </p>

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
          className="block text-center bg-green-600 hover:bg-green-500 rounded-3xl p-5 text-xl font-bold"
        >
          🚀 Start Earning
        </a>

      </div>

    </main>
  );
}