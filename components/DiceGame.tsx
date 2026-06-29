"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DiceGameProps {
  balance: number;
  onRoll: (bet: number, prediction: "low" | "high") => Promise<{ result: number; win: number }>;
}

export default function DiceGame({ balance, onRoll }: DiceGameProps) {
  const [bet, setBet] = useState(10);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [win, setWin] = useState(0);
  const [prediction, setPrediction] = useState<"low" | "high" | null>(null);

  async function handleRoll(pred: "low" | "high") {
    if (rolling || bet > balance) return;

    setRolling(true);
    setPrediction(pred);
    setResult(null);
    setWin(0);

    // Roll animation
    const rollInterval = setInterval(() => {
      setResult(Math.floor(Math.random() * 100) + 1);
    }, 100);

    setTimeout(async () => {
      clearInterval(rollInterval);
      const gameResult = await onRoll(bet, pred);
      setResult(gameResult.result);
      setWin(gameResult.win);
      setRolling(false);
    }, 1500);
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">🎲 Dice</h2>

      {/* Dice Display */}
      <div className="flex justify-center mb-8">
        <motion.div
          className="w-32 h-32 bg-gradient-to-br from-zinc-800 to-zinc-900 border-4 border-blue-600 rounded-2xl flex items-center justify-center text-6xl"
          animate={rolling ? { rotate: 360 } : {}}
          transition={{ duration: 0.3, repeat: rolling ? Infinity : 0 }}
        >
          {result !== null ? result : "🎲"}
        </motion.div>
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

      {/* Prediction Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handleRoll("low")}
          disabled={rolling || bet > balance}
          className={`py-4 rounded-xl font-bold text-xl transition ${
            rolling || bet > balance
              ? "bg-zinc-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          🔽 Low (1-50)
        </button>
        <button
          onClick={() => handleRoll("high")}
          disabled={rolling || bet > balance}
          className={`py-4 rounded-xl font-bold text-xl transition ${
            rolling || bet > balance
              ? "bg-zinc-700 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-500"
          }`}
        >
          🔼 High (51-100)
        </button>
      </div>

      {/* Info */}
      <div className="text-center text-zinc-500 text-sm">
        <p>Roll 1-50 for Low, 51-100 for High</p>
        <p>Win 2x your bet!</p>
      </div>
    </div>
  );
}
