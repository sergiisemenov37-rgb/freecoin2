"use client";

import { useState, useEffect } from "react";
import { buyLotteryTickets, getMyLotteryTickets, syncMining } from "../../lib/api";
import { TICKET_PRICE, getTimeUntilDraw, getWinningChance } from "../../lib/lottery";
import { getLotteryTicketPrice, getVIPStatus } from "../../lib/vip";

export default function LotteryPage() {
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [totalTickets, setTotalTickets] = useState(1000);
  const [prizePool, setPrizePool] = useState(50000);
  const [balance, setBalance] = useState(0);
  const [vipLevel, setVipLevel] = useState(0);
  const [miningLevel, setMiningLevel] = useState(10);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [user, tickets] = await Promise.all([
      syncMining(),
      getMyLotteryTickets()
    ]);
    if (user) {
      setBalance(user.free_balance);
      setMiningLevel(user.miner_level || 10);
    }
    setMyTickets(tickets);
    setLoading(false);
  }

  const vip = getVIPStatus(balance, miningLevel);
  const ticketPrice = getLotteryTicketPrice(vip);
  const timeUntilDraw = getTimeUntilDraw();
  const winningChance = getWinningChance(myTickets.length, totalTickets);

  async function buyTicket() {
    if (balance < ticketPrice) {
      alert("Not enough FREE!");
      return;
    }

    setBuying(true);
    
    const result = await buyLotteryTickets(1);
    
    if (result) {
      setTotalTickets(prev => prev + 1);
      setPrizePool(prev => prev + Math.floor(ticketPrice * 0.7));
      await loadData();
    }
    
    setBuying(false);
  }

  async function buyMultipleTickets(count: number) {
    const totalCost = ticketPrice * count;
    
    if (balance < totalCost) {
      alert(`Not enough FREE! Need ${totalCost} FREE`);
      return;
    }

    setBuying(true);
    
    const result = await buyLotteryTickets(count);
    
    if (result) {
      setTotalTickets(prev => prev + count);
      setPrizePool(prev => prev + Math.floor(totalCost * 0.7));
      await loadData();
    }
    
    setBuying(false);
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-purple-400 mb-8">🎰 Lottery</h1>

      {/* Current Draw Info */}
      <div className="bg-zinc-950 border border-purple-700 rounded-3xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-400">Current Draw</h2>
          <div className="text-right">
            <p className="text-zinc-500 text-sm">Time until draw</p>
            <p className="text-xl font-bold text-white">{timeUntilDraw}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 rounded-2xl p-4 text-center">
            <p className="text-zinc-500 text-sm">Prize Pool</p>
            <p className="text-3xl font-bold text-green-400">{prizePool.toLocaleString()}</p>
            <p className="text-zinc-500 text-xs">FREE</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-4 text-center">
            <p className="text-zinc-500 text-sm">Total Tickets</p>
            <p className="text-3xl font-bold text-blue-400">{totalTickets.toLocaleString()}</p>
            <p className="text-zinc-500 text-xs">Sold</p>
          </div>
        </div>
      </div>

      {/* Your Tickets */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Your Tickets</h2>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 bg-zinc-900 rounded-2xl p-4 text-center">
            <p className="text-4xl font-bold text-purple-400">{myTickets.length}</p>
            <p className="text-zinc-500 text-sm">Tickets Owned</p>
          </div>

          <div className="flex-1 bg-zinc-900 rounded-2xl p-4 text-center">
            <p className="text-4xl font-bold text-green-400">{winningChance.toFixed(2)}%</p>
            <p className="text-zinc-500 text-sm">Winning Chance</p>
          </div>
        </div>

        {vip.level > 0 && (
          <div className="bg-purple-950 border border-purple-700 rounded-2xl p-3 text-center">
            <p className="text-purple-400 text-sm">
              VIP Discount: {vip.lotteryDiscount * 100}% off tickets
            </p>
          </div>
        )}
      </div>

      {/* Buy Tickets */}
      <div className="bg-zinc-950 border border-green-700 rounded-3xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Buy Tickets</h2>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-zinc-500 text-sm">Ticket Price</p>
            <p className="text-2xl font-bold text-green-400">{ticketPrice} FREE</p>
          </div>

          <div>
            <p className="text-zinc-500 text-sm">Your Balance</p>
            <p className="text-2xl font-bold text-white">{balance.toLocaleString()} FREE</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => buyTicket()}
            disabled={buying}
            className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 rounded-2xl py-4 font-bold text-lg transition"
          >
            {buying ? 'Buying...' : 'Buy 1 Ticket'}
          </button>

          <button
            onClick={() => buyMultipleTickets(5)}
            disabled={buying}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 rounded-2xl py-4 font-bold text-lg transition"
          >
            {buying ? 'Buying...' : 'Buy 5 Tickets'}
          </button>

          <button
            onClick={() => buyMultipleTickets(10)}
            disabled={buying}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 rounded-2xl py-4 font-bold text-lg transition"
          >
            {buying ? 'Buying...' : 'Buy 10 Tickets'}
          </button>

          <button
            onClick={() => buyMultipleTickets(50)}
            disabled={buying}
            className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-700 rounded-2xl py-4 font-bold text-lg transition"
          >
            Buy 50 Tickets
          </button>
        </div>
      </div>

      {/* Prize Distribution */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Prize Distribution</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-zinc-900 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥇</span>
              <span className="font-bold">1st Place</span>
            </div>
            <span className="text-green-400 font-bold">{(prizePool * 0.50).toLocaleString()} FREE</span>
          </div>

          <div className="flex justify-between items-center bg-zinc-900 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥈</span>
              <span className="font-bold">2nd Place</span>
            </div>
            <span className="text-green-400 font-bold">{(prizePool * 0.25).toLocaleString()} FREE</span>
          </div>

          <div className="flex justify-between items-center bg-zinc-900 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥉</span>
              <span className="font-bold">3rd Place</span>
            </div>
            <span className="text-green-400 font-bold">{(prizePool * 0.15).toLocaleString()} FREE</span>
          </div>

          <div className="flex justify-between items-center bg-zinc-900 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏅</span>
              <span className="font-bold">4-10th Place</span>
            </div>
            <span className="text-green-400 font-bold">{(prizePool * 0.10).toLocaleString()} FREE</span>
          </div>
        </div>
      </div>
    </main>
  );
}
