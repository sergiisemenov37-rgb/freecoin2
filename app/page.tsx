"use client";

import { useCallback, useEffect, useState } from "react";

import ASICMiner from "../components/ASICMiner";
import MiningStats from "../components/MiningStats";
import MiningProgress from "../components/MiningProgress";
import UpgradeCard from "../components/UpgradeCard";
import AchievementsCard from "../components/AchievementsCard";
import StreakCard from "../components/StreakCard";
import EventCard from "../components/EventCard";
import SeasonCard from "../components/SeasonCard";
import { registerUser, syncMining } from "../lib/api";
import { AppUser, getTelegramUser } from "../lib/telegramUser";

function applyUser(
  user: AppUser,
  setters: {
    setBalance: (v: number) => void;
    setCompleted: (v: number) => void;
    setMinerLevel: (v: number) => void;
    setMinerPower: (v: number) => void;
  }
) {
  setters.setBalance(Number(user.free_balance || 0));
  setters.setCompleted(user.tasks_completed || 0);
  setters.setMinerLevel(user.miner_level || 1);
  setters.setMinerPower(Number(user.miner_power || 0.2));
}

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [minerLevel, setMinerLevel] = useState(1);
  const [minerPower, setMinerPower] = useState(0.2);
  const [name, setName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [inTelegram, setInTelegram] = useState(false);
  const [miningActive, setMiningActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [referrals, setReferrals] = useState(0);

  const syncUser = useCallback((user: AppUser) => {
    applyUser(user, {
      setBalance,
      setCompleted,
      setMinerLevel,
      setMinerPower,
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      localStorage.setItem("ref", ref);
    }

    async function init() {
      const telegramUser = getTelegramUser();

      if (!telegramUser) {
        // Demo mode for browser testing
        setInTelegram(true);
        setName("Demo User");
        setBalance(1000);
        setMinerLevel(2);
        setMinerPower(0.5);
        setStreak(5);
        setReferrals(3);
        setMiningActive(true);
        setLoading(false);
        return;
      }

      setInTelegram(true);
      setName(telegramUser.first_name || "User");

      const referrerId = localStorage.getItem("ref");
      const user = await registerUser(referrerId);

      if (!user) {
        setLoading(false);
        return;
      }

      const mined = await syncMining();
      syncUser(mined ?? user);
      setMiningActive(true);
      setLoading(false);
    }

    init();
  }, [syncUser]);

  useEffect(() => {
    if (!miningActive) return;

    const interval = setInterval(async () => {
      const mined = await syncMining();
      if (mined) {
        syncUser(mined);
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [miningActive, syncUser]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </main>
    );
  }

  if (!inTelegram) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-8 text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-4">FREECOIN</h1>
          <p className="text-zinc-400 mb-6">
            Open FREECOIN from the Telegram bot for full experience.
          </p>
          <a
            href="https://t.me/freecoinbot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-500 rounded-2xl px-8 py-4 font-bold text-lg transition mb-4"
          >
            Open in Telegram
          </a>
          <p className="text-zinc-600 text-xs mt-4">
            Or continue in browser (demo mode)
          </p>
        </div>
      </main>
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
          <h2 className="text-3xl font-bold">👋 {name}</h2>
          <p className="text-zinc-500 mt-2">Welcome back Miner</p>
        </div>

        <EventCard />

        <SeasonCard />

        <MiningStats balance={balance} power={minerPower} />

        <ASICMiner minerPower={minerPower} minerLevel={minerLevel} />

        <MiningProgress />

        <UpgradeCard
          level={minerLevel}
          power={minerPower}
          balance={balance}
          onUpgrade={(level, power, newBalance) => {
            setMinerLevel(level);
            setMinerPower(power);
            setBalance(newBalance);
          }}
        />

        <StreakCard 
          streak={streak}
          onClaimBonus={() => {}}
          canClaim={false}
        />

        <AchievementsCard
          level={minerLevel}
          balance={balance}
          referrals={referrals}
          tasksCompleted={completed}
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
            <p className="text-zinc-500">Tasks Completed</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">
              {completed}
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 text-center">
            <p className="text-zinc-500">Miner Level</p>
            <p className="text-3xl font-bold text-green-400 mt-2">
              LVL {minerLevel}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
