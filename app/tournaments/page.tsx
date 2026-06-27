"use client";

import { useState } from "react";
import { generateWeeklyTournament, getTimeUntilTournamentEnd, canJoinTournament, calculateTournamentScore, type Tournament } from "../../lib/tournaments";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([
    generateWeeklyTournament()
  ]);
  const [myTournaments, setMyTournaments] = useState<string[]>([]);
  const [balance, setBalance] = useState(1000);
  const [loading, setLoading] = useState(false);

  async function joinTournament(tournament: Tournament) {
    if (!canJoinTournament(tournament, balance)) {
      alert('Cannot join tournament');
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setBalance(prev => prev - tournament.entryFee);
    setMyTournaments(prev => [...prev, tournament.id]);
    
    // Update tournament participants
    setTournaments(prev => prev.map(t => 
      t.id === tournament.id 
        ? { ...t, currentParticipants: t.currentParticipants + 1, status: 'active' as const }
        : t
    ));

    setLoading(false);
    alert('Successfully joined tournament!');
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-amber-400 mb-8">🏆 Tournaments</h1>

      {/* Balance */}
      <div className="bg-zinc-950 border border-green-700 rounded-3xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Your Balance</span>
          <span className="text-2xl font-bold text-green-400">{balance.toLocaleString()} FREE</span>
        </div>
      </div>

      {/* Active Tournaments */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Active Tournaments</h2>
        
        {tournaments.map((tournament) => {
          const isJoined = myTournaments.includes(tournament.id);
          const canJoin = canJoinTournament(tournament, balance);
          const timeLeft = getTimeUntilTournamentEnd(tournament);
          
          return (
            <div
              key={tournament.id}
              className={`bg-zinc-950 border rounded-3xl p-6 ${
                tournament.status === 'active' ? 'border-green-700' : 'border-zinc-800'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">🏆</div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-white">{tournament.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tournament.status === 'active' ? 'bg-green-600' : 'bg-zinc-700'
                    }`}>
                      {tournament.status}
                    </span>
                  </div>
                  
                  <p className="text-zinc-500 text-sm mb-3">{tournament.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-zinc-900 rounded-xl p-3 text-center">
                      <p className="text-zinc-500 text-xs">Prize Pool</p>
                      <p className="text-xl font-bold text-green-400">{tournament.prizePool.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-zinc-900 rounded-xl p-3 text-center">
                      <p className="text-zinc-500 text-xs">Entry Fee</p>
                      <p className="text-xl font-bold text-yellow-400">{tournament.entryFee}</p>
                    </div>
                    
                    <div className="bg-zinc-900 rounded-xl p-3 text-center">
                      <p className="text-zinc-500 text-xs">Participants</p>
                      <p className="text-xl font-bold text-blue-400">
                        {tournament.currentParticipants}/{tournament.maxParticipants}
                      </p>
                    </div>
                    
                    <div className="bg-zinc-900 rounded-xl p-3 text-center">
                      <p className="text-zinc-500 text-xs">Time Left</p>
                      <p className="text-xl font-bold text-white">{timeLeft}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rewards */}
              <div className="bg-zinc-900 rounded-2xl p-4 mb-4">
                <h4 className="font-bold text-white mb-3">Rewards</h4>
                <div className="space-y-2">
                  {tournament.rewards.slice(0, 4).map((reward, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">{reward.rank}</span>
                      <span className="text-green-400 font-bold">{reward.reward.toLocaleString()} FREE</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {isJoined ? (
                <div className="bg-green-950 border border-green-700 rounded-xl p-3 text-center">
                  <p className="text-green-400 font-bold">✓ You're participating!</p>
                </div>
              ) : (
                <button
                  onClick={() => joinTournament(tournament)}
                  disabled={!canJoin || loading}
                  className={`w-full rounded-xl py-4 font-bold transition ${
                    canJoin
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-zinc-700 cursor-not-allowed'
                  }`}
                >
                  {loading ? '...' : canJoin ? `Join (${tournament.entryFee} FREE)` : 'Cannot Join'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* My Tournaments */}
      {myTournaments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">My Tournaments</h2>
          
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">You are participating in {myTournaments.length} tournament(s)</p>
            
            <div className="mt-4 bg-zinc-900 rounded-2xl p-4">
              <h4 className="font-bold text-white mb-2">Your Score</h4>
              <p className="text-3xl font-bold text-green-400">
                {calculateTournamentScore('mining', balance, 10, 5, 20).toLocaleString()}
              </p>
              <p className="text-zinc-500 text-sm">Based on your current stats</p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-blue-950 border border-blue-700 rounded-3xl p-6">
        <h3 className="font-bold text-blue-400 mb-2">💡 Tournament Tips</h3>
        <ul className="text-zinc-400 text-sm space-y-1">
          <li>• Tournaments run weekly with different themes</li>
          <li>• Entry fees contribute to the prize pool</li>
          <li>• Top participants win big rewards</li>
          <li>• Practice your skills before joining</li>
        </ul>
      </div>
    </main>
  );
}
