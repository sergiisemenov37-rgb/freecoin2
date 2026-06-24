"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const [wallet, setWallet] =
    useState("");

  const [balance, setBalance] =
    useState(0);

  const [completed, setCompleted] =
    useState(0);

  const [referrals, setReferrals] =
    useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const savedWallet =
      localStorage.getItem("wallet");

    if (!savedWallet) return;

    setWallet(savedWallet);

    const { data } =
      await supabase
        .from("users")
        .select("*")
        .eq("wallet", savedWallet)
        .single();

    if (data) {
      setBalance(
        data.free_balance || 0
      );

      setCompleted(
        data.tasks_completed || 0
      );

      setReferrals(
        data.referrals || 0
      );
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-5xl font-bold mb-10">
        👤 Profile
      </h1>

      <div className="grid gap-6 max-w-4xl">

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-xl font-bold mb-3">
            Wallet
          </h2>

          <p className="text-green-400 break-all">
            {wallet || "Not Connected"}
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-4">

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

            <p className="text-zinc-500">
              FREE Balance
            </p>

            <p className="text-4xl font-bold text-green-400">
              {balance}
            </p>

          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

            <p className="text-zinc-500">
              Tasks Completed
            </p>

            <p className="text-4xl font-bold text-yellow-400">
              {completed}
            </p>

          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

            <p className="text-zinc-500">
              Referrals
            </p>

            <p className="text-4xl font-bold text-blue-400">
              {referrals}
            </p>

          </div>

        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-xl font-bold mb-4">
            Quick Actions
          </h2>

          <div className="flex flex-col gap-3">

            <a
              href="/tasks"
              className="bg-green-600 hover:bg-green-500 rounded-xl p-3 text-center"
            >
              🎯 Tasks
            </a>

            <a
              href="/referrals"
              className="bg-blue-600 hover:bg-blue-500 rounded-xl p-3 text-center"
            >
              👥 Referrals
            </a>

            <a
              href="/withdraw"
              className="bg-purple-600 hover:bg-purple-500 rounded-xl p-3 text-center"
            >
              💸 Withdraw
            </a>

          </div>

        </div>

      </div>

    </main>
  );
}