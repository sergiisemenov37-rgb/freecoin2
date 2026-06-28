"use client";

import { useState, useEffect } from "react";
import { getTournaments, getMyTournaments, joinTournament as joinTournamentApi, syncMining } from "../../lib/api";
import { getTimeUntilTournamentEnd, canJoinTournament, calculateTournamentScore } from "../../lib/tournaments";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [myTournaments, setMyTournaments] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [user, tournamentsData, myTournamentsData] = await Promise.all([
      syncMining(),
      getTournaments(),
      getMyTournaments()
    ]);
    if (user) setBalance(user.free_balance);
    setTournaments(tournamentsData);
    setMyTournaments(myTournamentsData);
    setLoading(false);
  }

  async function joinTournament(tournamentId: number, entryFee: number) {
    if (balance < entryFee) {
      alert('Insufficient balance');
      return;
    }

    setJoining(tournamentId);
    const result = await joinTournamentApi(tournamentId);
    
    if (result) {
      await loadData();
      alert('Successfully joined tournament!');
    }
    
    setJoining(null);
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
          const isJoined = myTournaments.some((mt: any) => mt.tournament_id === tournament.id);
          const canJoin = balance >= tournament.entry_fee && tournament.current_participants < tournament.max_participants;
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
                      <p className="text-xl font-bold text-green-400">{tournament.prize_pool?.toLocaleString() || 0}</p>
                    </div>
                    
                    <div className="bg-zinc-900 rounded-xl p-3 text-center">
                      <p className="text-zinc-500 text-xs">Entry Fee</p>
                      <p className="text-xl font-bold text-yellow-400">{tournament.entry_fee}</p>
                    </div>
                    
                    <div className="bg-zinc-900 rounded-xl p-3 text-center">
                      <p className="text-zinc-500 text-xs">Participants</p>
                      <p className="text-xl font-bold text-blue-400">
                        {tournament.current_participants}/{tournament.max_participants}
                      </p>
                    </div>
                    
                    <div className="bg-zinc-900 rounded-xl p-3 text-center">
                      <p className="text-zinc-500 text-xs">Time Left</p>
                      <p className="text-xl font-bold text-white">{timeLeft}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {isJoined ? (
                <div className="bg-green-950 border border-green-700 rounded-xl p-3 text-center">
                  <p className="text-green-400 font-bold">✓ You're participating!</p>
                </div>
              ) : (
                <button
                  onClick={() => joinTournament(tournament.id, tournament.entry_fee)}
                  disabled={!canJoin || joining === tournament.id}
                  className={`w-full rounded-xl py-4 font-bold transition ${
                    canJoin
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-zinc-700 cursor-not-allowed'
                  }`}
                >
                  {joining === tournament.id ? 'Joining...' : canJoin ? `Join (${tournament.entry_fee} FREE)` : 'Cannot Join'}
                </button>
              )}
            </div>
          );
        })}

        {tournaments.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No active tournaments</p>
          </div>
        )}
      </div>

      {/* My Tournaments */}
      {myTournaments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">My Tournaments</h2>
          
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">You are participating in {myTournaments.length} tournament(s)</p>
            
            {myTournaments.map((mt: any) => (
              <div key={mt.id} className="mt-4 bg-zinc-900 rounded-2xl p-4">
                <h4 className="font-bold text-white mb-2">{mt.tournaments?.name || 'Tournament'}</h4>
                <p className="text-3xl font-bold text-green-400">
                  {mt.score?.toLocaleString() || 0}
                </p>
                <p className="text-zinc-500 text-sm">Your current score</p>
              </div>
            ))}
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
