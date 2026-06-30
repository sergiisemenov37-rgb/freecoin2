"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ReactionGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export default function ReactionGame({ onComplete, onBack }: ReactionGameProps) {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "clicked" | "result">("waiting");
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [attempts, setAttempts] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [showGreen, setShowGreen] = useState(false);

  useEffect(() => {
    if (gameState === "waiting") {
      const delay = Math.random() * 3000 + 2000; // 2-5 seconds
      const timeout = setTimeout(() => {
        setGameState("ready");
        setShowGreen(true);
        setStartTime(Date.now());
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  function handleClick() {
    if (gameState === "waiting") {
      // Too early!
      setGameState("result");
      setReactionTime(-1);
    } else if (gameState === "ready") {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setGameState("clicked");
      
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
      }

      setTimeout(() => {
        setAttempts(prev => prev + 1);
        if (attempts + 1 >= 5) {
          const avgScore = bestTime ? Math.max(0, 100 - bestTime) : 0;
          onComplete(avgScore);
        } else {
          setGameState("waiting");
          setShowGreen(false);
        }
      }, 1500);
    }
  }

  function restart() {
    setGameState("waiting");
    setStartTime(0);
    setReactionTime(0);
    setAttempts(0);
    setBestTime(null);
    setShowGreen(false);
  }

  if (gameState === "result" && reactionTime === -1) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-6">⚡ Too Early!</h2>
        
        <div className="text-6xl mb-4">😢</div>
        
        <p className="text-zinc-400 mb-6">Wait for the screen to turn green!</p>

        <button onClick={() => setGameState("waiting")} className="bg-purple-600 hover:bg-purple-500 rounded-xl py-3 font-bold">
          Try Again
        </button>
      </div>
    );
  }

  if (gameState === "clicked") {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-center">
        <h2 className="text-2xl font-bold text-purple-400 mb-6">⚡ Reaction Time</h2>
        
        <div className="text-6xl mb-4">{reactionTime}ms</div>
        
        <p className="text-zinc-400 mb-2">
          {reactionTime < 200 ? "🔥 Amazing!" : 
           reactionTime < 300 ? "⚡ Great!" : 
           reactionTime < 400 ? "👍 Good!" : 
           reactionTime < 500 ? "😐 Average" : "🐢 Slow"}
        </p>
        {bestTime && <p className="text-green-400 text-sm mb-6">Best: {bestTime}ms</p>}
        <p className="text-zinc-500 text-sm mb-6">Attempt {attempts + 1}/5</p>

        <button onClick={() => setGameState("waiting")} className="bg-purple-600 hover:bg-purple-500 rounded-xl py-3 font-bold">
          Next
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-zinc-400 hover:text-white">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-purple-400">⚡ Reaction</h2>
        <div className="text-zinc-400">
          {attempts + 1}/5
        </div>
      </div>

      <motion.button
        onClick={handleClick}
        className={`w-full h-64 rounded-3xl text-4xl font-bold transition ${
          showGreen
            ? "bg-green-600 hover:bg-green-500"
            : "bg-red-600 hover:bg-red-500"
        }`}
        animate={{
          scale: gameState === "waiting" ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: gameState === "waiting" ? Infinity : 0,
        }}
      >
        {showGreen ? "CLICK!" : "WAIT..."}
      </motion.button>

      <div className="text-center text-zinc-500 text-sm mt-6">
        <p>Click when the screen turns green!</p>
        {bestTime && <p className="text-green-400 mt-2">Best: {bestTime}ms</p>}
      </div>
    </div>
  );
}
