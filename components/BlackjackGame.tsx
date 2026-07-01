"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Card {
  suit: string;
  value: string;
  numericValue: number;
}

const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      let numericValue = parseInt(value);
      if (value === 'A') numericValue = 11;
      else if (['J', 'Q', 'K'].includes(value)) numericValue = 10;
      
      deck.push({ suit, value, numericValue });
    }
  }
  return deck;
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function calculateHandValue(hand: Card[]): number {
  let value = hand.reduce((sum, card) => sum + card.numericValue, 0);
  let aces = hand.filter(card => card.value === 'A').length;
  
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  return value;
}

export default function BlackjackGame({ onPlay, balance }: { onPlay: (bet: number, result: string) => void, balance: number }) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [bet, setBet] = useState(10);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'finished'>('betting');
  const [result, setResult] = useState<string>('');
  const [dealerHidden, setDealerHidden] = useState(true);

  const startGame = () => {
    if (bet > balance) return;
    
    const newDeck = shuffleDeck(createDeck());
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    const dealerCards = [newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameState('playing');
    setDealerHidden(true);
    setResult('');
  };

  const hit = () => {
    if (deck.length === 0) return;
    
    const newCard = deck.pop()!;
    const newPlayerHand = [...playerHand, newCard];
    setPlayerHand(newPlayerHand);
    setDeck(deck);
    
    const playerValue = calculateHandValue(newPlayerHand);
    if (playerValue > 21) {
      setDealerHidden(false);
      setGameState('finished');
      setResult('bust');
      onPlay(bet, 'lose');
    }
  };

  const stand = () => {
    setDealerHidden(false);
    
    let newDealerHand = [...dealerHand];
    let newDeck = [...deck];
    
    while (calculateHandValue(newDealerHand) < 17) {
      if (newDeck.length === 0) break;
      newDealerHand.push(newDeck.pop()!);
    }
    
    setDealerHand(newDealerHand);
    setDeck(newDeck);
    setGameState('finished');
    
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(newDealerHand);
    
    if (dealerValue > 21) {
      setResult('dealer_bust');
      onPlay(bet, 'win');
    } else if (playerValue > dealerValue) {
      setResult('win');
      onPlay(bet, 'win');
    } else if (playerValue < dealerValue) {
      setResult('lose');
      onPlay(bet, 'lose');
    } else {
      setResult('push');
      onPlay(bet, 'push');
    }
  };

  const resetGame = () => {
    setGameState('betting');
    setPlayerHand([]);
    setDealerHand([]);
    setResult('');
  };

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
      <h3 className="text-2xl font-bold text-white mb-4">🃏 Blackjack</h3>
      
      {gameState === 'betting' && (
        <div className="space-y-4">
          <div>
            <label className="text-zinc-400 text-sm">Bet Amount</label>
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 text-white"
              min="1"
              max={balance}
            />
          </div>
          
          <button
            onClick={startGame}
            disabled={bet > balance}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 rounded-xl py-3 font-bold transition"
          >
            Deal ({bet} FREE)
          </button>
        </div>
      )}
      
      {gameState !== 'betting' && (
        <div className="space-y-4">
          {/* Dealer Hand */}
          <div className="bg-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-sm mb-2">Dealer ({dealerHidden ? '?' : dealerValue})</p>
            <div className="flex gap-2">
              {dealerHand.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-12 h-16 bg-white rounded-lg flex items-center justify-center text-xl font-bold ${
                    dealerHidden && index === 1 ? 'bg-zinc-600' : ''
                  }`}
                >
                  {dealerHidden && index === 1 ? '?' : (
                    <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}>
                      {card.value}{card.suit}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Player Hand */}
          <div className="bg-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-sm mb-2">Player ({playerValue})</p>
            <div className="flex gap-2">
              {playerHand.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-12 h-16 bg-white rounded-lg flex items-center justify-center text-xl font-bold"
                >
                  <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}>
                    {card.value}{card.suit}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Result */}
          {gameState === 'finished' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center py-3 rounded-xl font-bold ${
                result === 'win' || result === 'dealer_bust' ? 'bg-green-600' :
                result === 'lose' || result === 'bust' ? 'bg-red-600' :
                'bg-zinc-600'
              }`}
            >
              {result === 'win' && `You Won ${bet} FREE!`}
              {result === 'lose' && `You Lost ${bet} FREE`}
              {result === 'push' && 'Push - Bet Returned'}
              {result === 'bust' && `Bust! You Lost ${bet} FREE`}
              {result === 'dealer_bust' && `Dealer Bust! You Won ${bet} FREE!`}
            </motion.div>
          )}
          
          {/* Actions */}
          {gameState === 'playing' && (
            <div className="flex gap-3">
              <button
                onClick={hit}
                className="flex-1 bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-bold transition"
              >
                Hit
              </button>
              <button
                onClick={stand}
                className="flex-1 bg-orange-600 hover:bg-orange-500 rounded-xl py-3 font-bold transition"
              >
                Stand
              </button>
            </div>
          )}
          
          {gameState === 'finished' && (
            <button
              onClick={resetGame}
              className="w-full bg-purple-600 hover:bg-purple-500 rounded-xl py-3 font-bold transition"
            >
              Play Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
