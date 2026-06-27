"use client";

import { useState, useEffect } from "react";
import { getLeaderboardTypeLabel, getPeriodLabel, getRankIcon, getRankColor, type LeaderboardFilters } from "../../lib/leaderboard";

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<LeaderboardFilters>({ type: 'balance', period: 'all' });
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockEntries = [
      { telegram_id: '1', username: 'crypto_king', first_name: 'Alex', free_balance: 500000, miner_level: 85, referrals_count: 150, total_mined: 1000000 },
      { telegram_id: '2', username: 'miner_pro', first_name: 'John', free_balance: 350000, miner_level: 72, referrals_count: 89, total_mined: 750000 },
      { telegram_id: '3', username: 'free_earner', first_name: 'Mike', free_balance: 280000, miner_level: 65, referrals_count: 67, total_mined: 600000 },
      { telegram_id: '4', username: 'diamond_hands', first_name: 'Sarah', free_balance: 220000, miner_level: 58, referrals_count: 45, total_mined: 500000 },
      { telegram_id: '5', username: 'hodl_warrior', first_name: 'Tom', free_balance: 180000, miner_level: 52, referrals_count: 34, total_mined: 420000 },
    ];
    
    setEntries(mockEntries);
    setLoading(false);
  }, [filter]);

  const getSortedEntries = () => {
    switch (filter.type) {
      case 'balance':
        return [...entries].sort((a, b) => b.free_balance - a.free_balance);
      case 'level':
        return [...entries].sort((a, b) => b.miner_level - a.miner_level);
      case 'referrals':
        return [...entries].sort((a, b) => b.referrals_count - a.referrals_count);
      case 'mined':
        return [...entries].sort((a, b) => b.total_mined - a.total_mined);
      default:
        return entries;
    }
  };

  const getValue = (entry: any) => {
    switch (filter.type) {
      case 'balance':
        return entry.free_balance.toLocaleString();
      case 'level':
        return `LVL ${entry.miner_level}`;
      case 'referrals':
        return entry.referrals_count;
      case 'mined':
        return entry.total_mined.toLocaleString();
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  const sortedEntries = getSortedEntries();

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-yellow-400 mb-8">🏆 Leaderboard</h1>

      {/* Filters */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 mb-6">
        <div className="flex gap-2 flex-wrap mb-4">
          {(['balance', 'level', 'referrals', 'mined'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter({ ...filter, type })}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                filter.type === type
                  ? 'bg-yellow-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {getLeaderboardTypeLabel(type)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(['all', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilter({ ...filter, period })}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                filter.period === period
                  ? 'bg-green-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {getPeriodLabel(period)}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {sortedEntries.map((entry, index) => (
          <div
            key={entry.telegram_id}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4"
          >
            <div className={`text-2xl font-bold w-12 text-center ${getRankColor(index + 1)}`}>
              {getRankIcon(index + 1)}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-white">{entry.first_name}</h3>
              <p className="text-zinc-500 text-sm">@{entry.username}</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">{getValue(entry)}</p>
              <p className="text-zinc-500 text-xs">{getLeaderboardTypeLabel(filter.type)}</p>
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No entries yet</p>
        </div>
      )}
    </main>
  );
}
