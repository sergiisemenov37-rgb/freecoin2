"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣"];
const PAYOUTS = {
  "🍒": 2,
  "🍋": 3,
  "🍊": 5,
  "🍇": 8,
  "💎": 15,
  "7️⃣": 25,
};

interface SlotsGameProps {
  balance: number;
  onSpin: (bet: number) => Promise<{ result: string[]; win: number }>;
}

export default function SlotsGame({ balance, onSpin }: SlotsGameProps) {
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(["🍒", "🍒", "🍒"]);
  const [win, setWin] = useState(0);

  async function handleSpin() {
    if (spinning || bet > balance) return;

    setSpinning(true);
    setWin(0);

    // Spin animation
    const spinInterval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
    }, 100);

    setTimeout(async () => {
      clearInterval(spinInterval);
      const result = await onSpin(bet);
      setReels(result.result);
      setWin(result.win);
      setSpinning(false);
    }, 2000);
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
      <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">🎰 Slots</h2>

      {/* Reels */}
      <div className="flex justify-center gap-4 mb-8">
        {reels.map((symbol, i) => (
          <motion.div
            key={i}
            className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 border-4 border-yellow-600 rounded-xl flex items-center justify-center text-5xl"
            animate={spinning ? { rotate: 360 } : {}}
            transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Win Display */}
      {win > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center mb-6"
        >
          <p className="text-green-400 text-2xl font-bold">🎉 YOU WON {win} FREE!</p>
        </motion.div>
      )}

      {/* Bet Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setBet(Math.max(10, bet - 10))}
            className="bg-zinc-700 hover:bg-zinc-600 rounded-lg px-4 py-2 font-bold"
          >
            -
          </button>
          <div className="bg-zinc-900 rounded-lg px-6 py-2 text-xl font-bold">
            Bet: {bet}
          </div>
          <button
            onClick={() => setBet(Math.min(balance, bet + 10))}
            className="bg-zinc-700 hover:bg-zinc-600 rounded-lg px-4 py-2 font-bold"
          >
            +
          </button>
        </div>
        <p className="text-center text-zinc-500 text-sm">Balance: {balance} FREE</p>
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={spinning || bet > balance}
        className={`w-full py-4 rounded-xl font-bold text-xl transition ${
          spinning || bet > balance
            ? "bg-zinc-700 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
        }`}
      >
        {spinning ? "🎰 Spinning..." : "🎰 SPIN"}
      </button>

      {/* Payouts */}
      <div className="mt-6 text-center">
        <p className="text-zinc-500 text-sm mb-2">Payouts (3x match):</p>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          {Object.entries(PAYOUTS).map(([symbol, payout]) => (
            <span key={symbol} className="bg-zinc-900 rounded px-2 py-1">
              {symbol}x3 = {payout}x
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
