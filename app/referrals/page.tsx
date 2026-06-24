"use client";

import { useEffect, useState } from "react";

export default function ReferralsPage() {
  const [wallet, setWallet] =
    useState("");

  useEffect(() => {
    const saved =
      localStorage.getItem("wallet");

    if (saved) {
      setWallet(saved);
    }
  }, []);

  const referralLink =
    wallet
      ? `${window.location.origin}/?ref=${wallet}`
      : "";

  async function copyLink() {
    await navigator.clipboard.writeText(
      referralLink
    );

    alert("Referral link copied");
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-5xl font-bold mb-10">
        👥 Referrals
      </h1>

      <div className="max-w-3xl mx-auto grid gap-6">

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-4">
            Your Referral Link
          </h2>

          <div className="bg-black border border-zinc-800 rounded-xl p-4 break-all text-green-400">
            {referralLink}
          </div>

          <button
            onClick={copyLink}
            className="mt-4 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl"
          >
            Copy Link
          </button>

        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-4">
            Referral Rewards
          </h2>

          <p className="text-zinc-400">
            Earn FREE tokens for every user
            who joins through your link.
          </p>

        </div>

      </div>

    </main>
  );
}