"use client";

import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

export default function WithdrawPage() {
  const [balance, setBalance] =
    useState(0);

  const [amount, setAmount] =
    useState("");

  const [wallet, setWallet] =
    useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
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
    }
  }

  async function requestWithdraw() {
    if (!amount) return;

    const withdrawAmount =
      Number(amount);

    if (withdrawAmount <= 0) {
      return;
    }

    if (withdrawAmount > balance) {
      alert("Not enough balance");
      return;
    }

    const { error } =
      await supabase
        .from("withdraw_requests")
        .insert([
          {
            wallet,
            amount: withdrawAmount,
            status: "pending",
          },
        ]);

    if (error) {
      alert("Withdraw failed");
      return;
    }

    alert(
      "Withdraw request sent"
    );

    setAmount("");
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-5xl font-bold mb-10">
        💸 Withdraw
      </h1>

      <div className="max-w-2xl mx-auto">

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

          <p className="text-zinc-500">
            Available Balance
          </p>

          <p className="text-5xl font-bold text-green-400 mt-3">
            {balance} FREE
          </p>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            className="w-full mt-6 bg-black border border-zinc-800 rounded-xl p-4"
          />

          <button
            onClick={requestWithdraw}
            className="w-full mt-4 bg-purple-600 hover:bg-purple-500 p-4 rounded-xl font-bold"
          >
            Request Withdraw
          </button>

        </div>

      </div>

    </main>
  );
}