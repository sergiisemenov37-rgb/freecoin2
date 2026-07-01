"use client";

import { useState, useEffect } from "react";
import { getLeaderboardTypeLabel, getPeriodLabel, getRankIcon, getRankColor, type LeaderboardFilters } from "../../lib/leaderboard";

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<LeaderboardFilters>({ type: 'balance', period: 'all' });
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?type=${filter.type}&limit=50`);
      const data = await response.json();
      setEntries(data.leaderboard || []);
      setUserRank(data.userRank);
      setUserData(data.userData);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
    setLoading(false);
  }

  const getValue = (entry: any) => {
    switch (filter.type) {
      case 'balance':
        return entry.balance.toLocaleString();
      case 'level':
        return `LVL ${entry.miner_level}`;
      case 'referrals':
        return entry.referrals;
      case 'mined':
        return entry.total_mined.toLocaleString();
      case 'games':
        return entry.games_played;
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

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-yellow-400 mb-8">🏆 Leaderboard</h1>

      {/* User Rank */}
      {userData && userRank && (
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">#{userRank}</div>
            <div className="flex-1">
              <h3 className="font-bold text-white">Your Rank</h3>
              <p className="text-yellow-200 text-sm">{getValue(userData)} {getLeaderboardTypeLabel(filter.type)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {(['mined', 'balance', 'referrals', 'level', 'games'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter({ ...filter, type })}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                filter.type === type
                  ? 'bg-yellow-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {type === 'mined' ? 'Total Mined' : 
               type === 'balance' ? 'Balance' :
               type === 'referrals' ? 'Referrals' :
               type === 'level' ? 'Miner Level' : 'Games'}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.telegram_id}
            className={`bg-zinc-950 border rounded-2xl p-4 flex items-center gap-4 ${
              entry.isCurrentUser ? 'border-yellow-600 bg-zinc-900' : 'border-zinc-800'
            }`}
          >
            <div className={`text-2xl font-bold w-12 text-center ${getRankColor(entry.rank)}`}>
              {getRankIcon(entry.rank)}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-white">{entry.name}</h3>
              <p className="text-zinc-500 text-sm">ID: {entry.telegram_id}</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">{getValue(entry)}</p>
              <p className="text-zinc-500 text-xs">{filter.type}</p>
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
