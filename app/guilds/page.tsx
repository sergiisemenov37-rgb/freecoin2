"use client";

import { useState, useEffect } from "react";
import { GUILD_CREATE_COST, GUILD_JOIN_COST, getGuildBonus, type Guild, type GuildMember } from "../../lib/guilds";

export default function GuildsPage() {
  const [myGuild, setMyGuild] = useState<Guild | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [balance, setBalance] = useState(5000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockGuilds: Guild[] = [
      {
        id: '1',
        name: 'Crypto Miners',
        description: 'Best miners in the game',
        emblem: '⛏️',
        leader_id: '1',
        leader_name: 'Alex',
        members_count: 45,
        total_power: 15000,
        total_balance: 500000,
        level: 3,
        created_at: '2024-01-01'
      },
      {
        id: '2',
        name: 'FREE Earners',
        description: 'Earning FREE together',
        emblem: '💰',
        leader_id: '2',
        leader_name: 'John',
        members_count: 32,
        total_power: 12000,
        total_balance: 380000,
        level: 2,
        created_at: '2024-01-15'
      },
      {
        id: '3',
        name: 'Diamond Hands',
        description: 'HODL till the moon',
        emblem: '💎',
        leader_id: '3',
        leader_name: 'Mike',
        members_count: 28,
        total_power: 10000,
        total_balance: 320000,
        level: 2,
        created_at: '2024-02-01'
      }
    ];
    
    setGuilds(mockGuilds);
  }, []);

  async function createGuild(name: string, description: string, emblem: string) {
    if (balance < GUILD_CREATE_COST) {
      alert(`Not enough FREE! Need ${GUILD_CREATE_COST} FREE`);
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newGuild: Guild = {
      id: Date.now().toString(),
      name,
      description,
      emblem,
      leader_id: 'me',
      leader_name: 'You',
      members_count: 1,
      total_power: 100,
      total_balance: balance - GUILD_CREATE_COST,
      level: 1,
      created_at: new Date().toISOString()
    };

    setMyGuild(newGuild);
    setBalance(prev => prev - GUILD_CREATE_COST);
    setShowCreate(false);
    setLoading(false);
  }

  async function joinGuild(guildId: string) {
    if (balance < GUILD_JOIN_COST) {
      alert(`Not enough FREE! Need ${GUILD_JOIN_COST} FREE`);
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const guild = guilds.find(g => g.id === guildId);
    if (guild) {
      setMyGuild(guild);
      setBalance(prev => prev - GUILD_JOIN_COST);
    }

    setLoading(false);
  }

  if (myGuild) {
    const bonus = getGuildBonus(myGuild.level);

    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-5xl font-bold text-purple-400 mb-8">🏰 My Guild</h1>

        {/* Guild Info */}
        <div className="bg-zinc-950 border border-purple-700 rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">{myGuild.emblem}</div>
            <div>
              <h2 className="text-3xl font-bold text-white">{myGuild.name}</h2>
              <p className="text-zinc-500">{myGuild.description}</p>
              <p className="text-purple-400 mt-2 font-bold">{bonus.name} Level {myGuild.level}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 rounded-2xl p-4 text-center">
              <p className="text-zinc-500 text-sm">Members</p>
              <p className="text-3xl font-bold text-blue-400">{myGuild.members_count}</p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 text-center">
              <p className="text-zinc-500 text-sm">Total Power</p>
              <p className="text-3xl font-bold text-green-400">{myGuild.total_power.toLocaleString()}</p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 text-center">
              <p className="text-zinc-500 text-sm">Total Balance</p>
              <p className="text-3xl font-bold text-yellow-400">{myGuild.total_balance.toLocaleString()}</p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 text-center">
              <p className="text-zinc-500 text-sm">Mining Bonus</p>
              <p className="text-3xl font-bold text-purple-400">+{(bonus.miningBonus * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Guild Bonuses */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Guild Bonuses</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-zinc-900 rounded-xl p-3">
              <span className="text-zinc-400">Mining Bonus</span>
              <span className="text-green-400 font-bold">+{(bonus.miningBonus * 100).toFixed(0)}%</span>
            </div>

            <div className="flex justify-between items-center bg-zinc-900 rounded-xl p-3">
              <span className="text-zinc-400">Referral Bonus</span>
              <span className="text-green-400 font-bold">+{(bonus.referralBonus * 100).toFixed(0)}%</span>
            </div>

            <div className="flex justify-between items-center bg-zinc-900 rounded-xl p-3">
              <span className="text-zinc-400">Max Members</span>
              <span className="text-blue-400 font-bold">{bonus.maxMembers}</span>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Members</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-zinc-900 rounded-xl p-3">
              <div className="text-2xl">👑</div>
              <div className="flex-1">
                <p className="font-bold text-white">{myGuild.leader_name}</p>
                <p className="text-zinc-500 text-sm">Leader</p>
              </div>
            </div>

            {Array.from({ length: Math.min(myGuild.members_count - 1, 5) }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 bg-zinc-900 rounded-xl p-3">
                <div className="text-2xl">👤</div>
                <div className="flex-1">
                  <p className="font-bold text-white">Member {i + 1}</p>
                  <p className="text-zinc-500 text-sm">Member</p>
                </div>
              </div>
            ))}

            {myGuild.members_count > 6 && (
              <p className="text-zinc-500 text-center text-sm">
                +{myGuild.members_count - 6} more members
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-purple-400 mb-8">🏰 Guilds</h1>

      {/* Create Guild Button */}
      <button
        onClick={() => setShowCreate(true)}
        className="w-full bg-purple-600 hover:bg-purple-500 rounded-3xl py-4 font-bold text-xl mb-6 transition"
      >
        Create Guild ({GUILD_CREATE_COST} FREE)
      </button>

      {/* Create Guild Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-zinc-950 border border-purple-700 rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Create Guild</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-zinc-400 text-sm">Guild Name</label>
                <input
                  type="text"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 mt-1 text-white"
                  placeholder="Enter guild name"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-sm">Description</label>
                <textarea
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 mt-1 text-white"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-zinc-400 text-sm">Choose Emblem</label>
                <div className="flex gap-2 mt-2">
                  {['⛏️', '💰', '💎', '🚀', '🔥', '⚡', '🌟', '👑'].map((emoji) => (
                    <button
                      key={emoji}
                      className="text-3xl p-2 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 rounded-xl py-3 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createGuild('My Guild', 'Awesome guild', '⛏️')}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 rounded-xl py-3 font-bold transition"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guilds List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Available Guilds</h2>
        
        {guilds.map((guild) => {
          const bonus = getGuildBonus(guild.level);
          
          return (
            <div
              key={guild.id}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{guild.emblem}</div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">{guild.name}</h3>
                  <p className="text-zinc-500 text-sm">{guild.description}</p>
                  <p className="text-purple-400 mt-2 font-bold">{bonus.name} Level {guild.level}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-zinc-900 rounded-xl p-3 text-center">
                  <p className="text-zinc-500 text-xs">Members</p>
                  <p className="text-xl font-bold text-blue-400">{guild.members_count}</p>
                </div>

                <div className="bg-zinc-900 rounded-xl p-3 text-center">
                  <p className="text-zinc-500 text-xs">Power</p>
                  <p className="text-xl font-bold text-green-400">{guild.total_power.toLocaleString()}</p>
                </div>

                <div className="bg-zinc-900 rounded-xl p-3 text-center">
                  <p className="text-zinc-500 text-xs">Bonus</p>
                  <p className="text-xl font-bold text-purple-400">+{(bonus.miningBonus * 100).toFixed(0)}%</p>
                </div>
              </div>

              <button
                onClick={() => joinGuild(guild.id)}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 rounded-xl py-3 font-bold transition"
              >
                Join ({GUILD_JOIN_COST} FREE)
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
