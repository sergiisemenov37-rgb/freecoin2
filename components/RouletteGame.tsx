"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface RouletteGameProps {
  balance: number;
  onSpin: (bet: number, betType: string, betValue: string) => Promise<{ result: number; win: number }>;
}

export default function RouletteGame({ balance, onSpin }: RouletteGameProps) {
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [win, setWin] = useState(0);
  const [betType, setBetType] = useState<"color" | "number" | "parity">("color");
  const [betValue, setBetValue] = useState("red");

  const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  async function handleSpin() {
    if (spinning || bet > balance) return;

    setSpinning(true);
    setResult(null);
    setWin(0);

    // Spin animation
    const spinInterval = setInterval(() => {
      setResult(Math.floor(Math.random() * 37));
    }, 100);

    setTimeout(async () => {
      clearInterval(spinInterval);
      const gameResult = await onSpin(bet, betType, betValue);
      setResult(gameResult.result);
      setWin(gameResult.win);
      setSpinning(false);
    }, 3000);
  }

  const getNumberColor = (num: number) => {
    if (num === 0) return "green";
    if (RED_NUMBERS.includes(num)) return "red";
    return "black";
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "red": return "bg-red-600";
      case "black": return "bg-zinc-800";
      case "green": return "bg-green-600";
      default: return "bg-zinc-700";
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
      <h2 className="text-2xl font-bold text-red-400 mb-6 text-center">🎰 Roulette</h2>

      {/* Roulette Wheel */}
      <div className="flex justify-center mb-8">
        <motion.div
          className="w-40 h-40 rounded-full border-8 border-yellow-600 flex items-center justify-center relative"
          animate={spinning ? { rotate: 360 } : {}}
          transition={{ duration: 3, repeat: spinning ? Infinity : 0, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-red-600" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-zinc-800" />
            <div className="absolute top-1/2 left-0 w-full h-1/2 bg-green-600" />
          </div>
          <div className="relative z-10 w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center text-4xl font-bold">
            {result !== null ? result : "0"}
          </div>
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

      {/* Bet Type Selection */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setBetType("color"); setBetValue("red"); }}
            className={`flex-1 py-2 rounded-xl font-bold transition ${
              betType === "color" ? "bg-purple-600" : "bg-zinc-700"
            }`}
          >
            Color
          </button>
          <button
            onClick={() => { setBetType("parity"); setBetValue("even"); }}
            className={`flex-1 py-2 rounded-xl font-bold transition ${
              betType === "parity" ? "bg-purple-600" : "bg-zinc-700"
            }`}
          >
            Even/Odd
          </button>
          <button
            onClick={() => { setBetType("number"); setBetValue("0"); }}
            className={`flex-1 py-2 rounded-xl font-bold transition ${
              betType === "number" ? "bg-purple-600" : "bg-zinc-700"
            }`}
          >
            Number
          </button>
        </div>

        {/* Bet Value Selection */}
        {betType === "color" && (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setBetValue("red")}
              className={`py-3 rounded-xl font-bold transition ${
                betValue === "red" ? "bg-red-600" : "bg-zinc-700"
              }`}
            >
              🔴 Red (2x)
            </button>
            <button
              onClick={() => setBetValue("black")}
              className={`py-3 rounded-xl font-bold transition ${
                betValue === "black" ? "bg-zinc-800" : "bg-zinc-700"
              }`}
            >
              ⚫ Black (2x)
            </button>
            <button
              onClick={() => setBetValue("green")}
              className={`py-3 rounded-xl font-bold transition ${
                betValue === "green" ? "bg-green-600" : "bg-zinc-700"
              }`}
            >
              🟢 Green (35x)
            </button>
          </div>
        )}

        {betType === "parity" && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setBetValue("even")}
              className={`py-3 rounded-xl font-bold transition ${
                betValue === "even" ? "bg-blue-600" : "bg-zinc-700"
              }`}
            >
              Even (2x)
            </button>
            <button
              onClick={() => setBetValue("odd")}
              className={`py-3 rounded-xl font-bold transition ${
                betValue === "odd" ? "bg-orange-600" : "bg-zinc-700"
              }`}
            >
              Odd (2x)
            </button>
          </div>
        )}

        {betType === "number" && (
          <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
            {Array.from({ length: 37 }, (_, i) => (
              <button
                key={i}
                onClick={() => setBetValue(i.toString())}
                className={`py-2 rounded-lg font-bold text-sm transition ${
                  betValue === i.toString() ? getColorClass(getNumberColor(i)) : "bg-zinc-700"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={spinning || bet > balance}
        className={`w-full py-4 rounded-xl font-bold text-xl transition ${
          spinning || bet > balance
            ? "bg-zinc-700 cursor-not-allowed"
            : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
        }`}
      >
        {spinning ? "🎰 Spinning..." : "🎰 SPIN"}
      </button>

      {/* Info */}
      <div className="mt-6 text-center text-zinc-500 text-sm">
        <p>Color bets: 2x payout</p>
        <p>Number bets: 35x payout</p>
      </div>
    </div>
  );
}
