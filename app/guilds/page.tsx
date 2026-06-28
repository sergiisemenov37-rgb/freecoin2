"use client";

import { useState, useEffect } from "react";
import { getGuilds, getMyGuild, createGuild as createGuildApi, joinGuild as joinGuildApi, syncMining } from "../../lib/api";
import { GUILD_CREATE_COST, GUILD_JOIN_COST, getGuildBonus, type Guild } from "../../lib/guilds";

export default function GuildsPage() {
  const [myGuild, setMyGuild] = useState<any>(null);
  const [guilds, setGuilds] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);
  const [selectedEmblem, setSelectedEmblem] = useState('⛏️');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [user, guildsData, myGuildData] = await Promise.all([
      syncMining(),
      getGuilds(),
      getMyGuild()
    ]);
    if (user) setBalance(user.free_balance);
    setGuilds(guildsData);
    setMyGuild(myGuildData);
    setLoading(false);
  }

  async function createGuild(name: string, description: string, emblem: string) {
    setCreating(true);
    const result = await createGuildApi(name, description, emblem);
    
    if (result) {
      await loadData();
      setShowCreate(false);
    }
    
    setCreating(false);
  }

  async function joinGuild(guildId: string) {
    setJoining(guildId);
    const result = await joinGuildApi(parseInt(guildId));
    
    if (result) {
      await loadData();
    }
    
    setJoining(null);
  }

  if (myGuild) {
    const bonus = getGuildBonus(myGuild.level);
    const membersCount = myGuild.guild_members?.length || 0;

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
              <p className="text-3xl font-bold text-blue-400">{membersCount}</p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 text-center">
              <p className="text-zinc-500 text-sm">Total Power</p>
              <p className="text-3xl font-bold text-green-400">{myGuild.total_power?.toLocaleString() || 0}</p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 text-center">
              <p className="text-zinc-500 text-sm">Total Balance</p>
              <p className="text-3xl font-bold text-yellow-400">{myGuild.total_balance?.toLocaleString() || 0}</p>
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
            {myGuild.guild_members?.map((member: any) => (
              <div key={member.id} className="flex items-center gap-3 bg-zinc-900 rounded-xl p-3">
                <div className="text-2xl">{member.role === 'leader' ? '👑' : '👤'}</div>
                <div className="flex-1">
                  <p className="font-bold text-white">{member.users?.first_name || 'Member'}</p>
                  <p className="text-zinc-500 text-sm">{member.role}</p>
                </div>
              </div>
            )) || <p className="text-zinc-500 text-center">No members yet</p>}
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
                  id="guildName"
                  type="text"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 mt-1 text-white"
                  placeholder="Enter guild name"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-sm">Description</label>
                <textarea
                  id="guildDesc"
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
                      onClick={() => setSelectedEmblem(emoji)}
                      className={`text-3xl p-2 rounded-xl transition ${selectedEmblem === emoji ? 'bg-purple-600' : 'bg-zinc-900 hover:bg-zinc-800'}`}
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
                  onClick={() => {
                    const name = (document.getElementById('guildName') as HTMLInputElement)?.value;
                    const desc = (document.getElementById('guildDesc') as HTMLTextAreaElement)?.value;
                    if (name) createGuild(name, desc, selectedEmblem);
                  }}
                  disabled={creating}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 rounded-xl py-3 font-bold transition"
                >
                  {creating ? 'Creating...' : 'Create'}
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
          const membersCount = guild.guild_members?.length || 0;
          
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
                  <p className="text-xl font-bold text-blue-400">{membersCount}</p>
                </div>

                <div className="bg-zinc-900 rounded-xl p-3 text-center">
                  <p className="text-zinc-500 text-xs">Power</p>
                  <p className="text-xl font-bold text-green-400">{guild.total_power?.toLocaleString() || 0}</p>
                </div>

                <div className="bg-zinc-900 rounded-xl p-3 text-center">
                  <p className="text-zinc-500 text-xs">Bonus</p>
                  <p className="text-xl font-bold text-purple-400">+{(bonus.miningBonus * 100).toFixed(0)}%</p>
                </div>
              </div>

              <button
                onClick={() => joinGuild(guild.id.toString())}
                disabled={joining === guild.id.toString()}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 rounded-xl py-3 font-bold transition"
              >
                {joining === guild.id.toString() ? 'Joining...' : `Join (${GUILD_JOIN_COST} FREE)`}
              </button>
            </div>
          );
        })}

        {guilds.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No guilds available</p>
          </div>
        )}
      </div>
    </main>
  );
}
