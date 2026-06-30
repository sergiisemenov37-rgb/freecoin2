"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SYMBOLS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍒", "🥝", "🍑"];

interface MemoryGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export default function MemoryGame({ onComplete, onBack }: MemoryGameProps) {
  const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  function initGame() {
    const shuffled = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        flipped: false,
        matched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameStarted(true);
  }

  function flipCard(index: number) {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      checkMatch(newFlipped);
    }
  }

  function checkMatch(indices: number[]) {
    const [first, second] = indices;
    const newCards = [...cards];

    if (cards[first].symbol === cards[second].symbol) {
      newCards[first].matched = true;
      newCards[second].matched = true;
      setCards(newCards);
      setMatchedPairs(prev => prev + 1);
      setFlippedCards([]);

      if (matchedPairs + 1 === SYMBOLS.length) {
        setTimeout(() => {
          const score = Math.max(0, 100 - moves * 2);
          onComplete(score);
        }, 500);
      }
    } else {
      setTimeout(() => {
        newCards[first].flipped = false;
        newCards[second].flipped = false;
        setCards(newCards);
        setFlippedCards([]);
      }, 1000);
    }
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-zinc-400 hover:text-white">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-purple-400">🧠 Memory</h2>
        <div className="text-zinc-400">
          Moves: {moves}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            onClick={() => flipCard(index)}
            disabled={!gameStarted}
            animate={{ rotateY: card.flipped ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`aspect-square rounded-xl text-4xl font-bold flex items-center justify-center transition ${
              card.matched
                ? "bg-green-600 cursor-default"
                : card.flipped
                ? "bg-zinc-700"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            {card.flipped || card.matched ? card.symbol : "?"}
          </motion.button>
        ))}
      </div>

      <div className="text-center text-zinc-500 text-sm">
        <p>Matched: {matchedPairs}/{SYMBOLS.length}</p>
        <p>Find all pairs to win!</p>
      </div>
    </div>
  );
}
