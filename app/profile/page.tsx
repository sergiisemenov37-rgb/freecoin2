"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import WalletButton from "../../components/WalletButton";
import { getVIPStatus } from "../../lib/vip";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [totalMined, setTotalMined] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const tg = (window as any)?.Telegram?.WebApp;
    const telegramUser = tg?.initDataUnsafe?.user;

    if (!telegramUser) return;

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", telegramUser.id.toString())
      .single();

    setUser(data);

    // Load referral count
    const { count } = await supabase
      .from("users")
      .select("*", { count: 'exact', head: true })
      .eq("referred_by", telegramUser.id.toString());

    setReferralCount(count || 0);

    // Calculate total mined (simplified)
    setTotalMined(data?.free_balance || 0);
  }

  const vip = getVIPStatus(user?.free_balance || 0, user?.miner_level || 1);
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown';

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold mb-10">👤 Profile</h1>

      <div className="grid gap-6 max-w-3xl">
        {/* VIP Status */}
        <div className={`bg-zinc-950 border rounded-3xl p-6 ${vip.level > 0 ? 'border-amber-700' : 'border-zinc-800'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{vip.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{vip.name} Status</h2>
              <p className={vip.color}>Level {vip.level}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 rounded-xl p-3 text-center">
              <p className="text-zinc-500 text-xs">Mining Bonus</p>
              <p className="text-green-400 font-bold">+{(vip.miningBonus * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-3 text-center">
              <p className="text-zinc-500 text-xs">Referral Bonus</p>
              <p className="text-green-400 font-bold">+{(vip.referralBonus * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
          <p className="text-zinc-400 mb-4">Connect Wallet</p>
          <WalletButton />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">FREE Balance</p>
            <p className="text-3xl font-bold text-green-400">
              {user?.free_balance?.toLocaleString() || 0}
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">Miner Level</p>
            <p className="text-3xl font-bold text-blue-400">
              LVL {user?.miner_level || 1}
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">Mining Power</p>
            <p className="text-3xl font-bold text-purple-400">
              {user?.miner_power?.toFixed(3) || 0.2}
            </p>
            <p className="text-zinc-500 text-xs">FREE/min</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">Tasks Completed</p>
            <p className="text-3xl font-bold text-yellow-400">
              {user?.tasks_completed || 0}
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">Referrals</p>
            <p className="text-3xl font-bold text-cyan-400">
              {referralCount}
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">Total Mined</p>
            <p className="text-3xl font-bold text-orange-400">
              {totalMined.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Account Info</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-500">Member Since</span>
              <span className="text-white">{joinDate}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-zinc-500">Telegram ID</span>
              <span className="text-white">{user?.telegram_id || 'Unknown'}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">Account Status</span>
              <span className={user?.banned ? "text-red-400" : "text-green-400"}>
                {user?.banned ? 'Banned' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-zinc-950 border border-green-700 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🔗 Referral Link</h2>
          
          <div className="bg-zinc-900 rounded-xl p-4 mb-4">
            <p className="text-green-400 text-sm break-all">
              https://t.me/freecoinbot?start={user?.telegram_id || 'your_id'}
            </p>
          </div>

          <p className="text-zinc-500 text-sm">
            Share this link to earn {getVIPStatus(user?.free_balance || 0, user?.miner_level || 1).referralBonus * 100}% referral bonus!
          </p>
        </div>
      </div>
    </main>
  );
}