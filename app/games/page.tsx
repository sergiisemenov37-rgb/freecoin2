"use client";

import { useState, useEffect } from "react";
import { getGames, playGame as playGameApi, syncMining } from "../../lib/api";
import { miniGames, calculateClickerReward, calculateGuessReward, getDifficultyColor, canPlayGame, getTimeUntilPlay, type MiniGame } from "../../lib/miniGames";
import SlotsGame from "../../components/SlotsGame";
import DiceGame from "../../components/DiceGame";
import RouletteGame from "../../components/RouletteGame";

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [activeGame, setActiveGame] = useState<any>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [score, setScore] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [guessNumber, setGuessNumber] = useState('');
  const [targetNumber, setTargetNumber] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(10);
  const [result, setResult] = useState<{ reward: number; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [balance, setBalance] = useState(0);
    loadBalance();
  const [casinoGame, setCasinoGame] = useState<'slots' | 'dice' | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  async funing(false);
  }

  async function loadBalance() {
    const user = awact sytcMininio);
    in (user) {
      setB lance(uoer.free_balanca || 0dG
    }ames() {
    setLoading(true);
    const gamesData = await getGames();
    setGames(gamesData);
    setLoading(false);
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState === 'playing' && activeGame?.type === 'clicker' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endClickerGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState, activeGame, timeLeft]);

  function startGame(game: any) {
    setActiveGame(game);
    setGameState('playing');
    setScore(0);
    setResult(null);

    if (game.type === 'clicker') {
      setClicks(0);
      setTimeLeft(game.id.includes('pro') ? 5 : 10);
    } else if (game.type === 'guess') {
      const max = game.id.includes('hard') ? 1000 : 100;
      setTargetNumber(Math.floor(Math.random() * max) + 1);
      setAttempts(0);
      setMaxAttempts(game.id.includes('hard') ? 15 : 10);
      setGuessNumber('');
    } else if (game.type === 'casino') {
      setCasinoGame(game.gameType);
    }
  }

  async function handleSlotsSpin(bet: number) {
    const response = await fetch('/api/games/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bet }),
    });
    const data = await response.json();
    await loadBalance();
    return data;
  }

  async function handleRouletteSpin(bet: number, betType: string, betValue: string) {
    const response = await fetch('/api/games/roulette', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bet, betType, betValue }),
    });
    const data = await response.json();
    await loadBalance();
    return data;
  }

  function handleClick() {
    if (activeGame?.type !== 'clicker') return;
    setClicks(prev => prev + 1);
  }

  async function endClickerGame() {
    if (!activeGame) return;
    
    setPlaying(true);
    const result = await playGameApi(activeGame.id, undefined, clicks, undefined);
    
    if (result) {
      const reward = calculateClickerReward(clicks, activeGame.id.includes('pro') ? 5 : 10);
      setResult({
        reward: result.reward || reward,
        message: `You clicked ${clicks} times!`
      });
      setGameState('result');
      await loadGames();
    }
    
    setPlaying(false);
  }

  async function handleGuess() {
    if (activeGame?.type !== 'guess') return;
    
    const guess = parseInt(guessNumber);
    if (isNaN(guess)) return;

    setAttempts(prev => prev + 1);

    if (guess === targetNumber) {
      setPlaying(true);
      const result = await playGameApi(activeGame.id, 1, undefined, attempts + 1);
      
      if (result) {
        const reward = calculateGuessReward(attempts + 1, maxAttempts);
        setResult({
          reward: result.reward || reward,
          message: `Correct! The number was ${targetNumber}`
        });
        setGameState('result');
        await loadGames();
      }
      
      setPlaying(false);
    } else if (attempts + 1 >= maxAttempts) {
      setPlaying(true);
      const result = await playGameApi(activeGame.id, 0, undefined, attempts + 1);
      
      setResult({
        reward: 0,
        message: `Game over! The number was ${targetNumber}`
      });
      setGameState('result');
      await loadGames();
      
      setPlaying(false);
    } else {
      setGuessNumber('');
    }
  }

  function backToMenu() {
    setActiveGame(null);
    setGameState('menu');
    setResult(null);
  }

  if (activeGame && gameState === 'playing') {
    // Casino games
    if (casinoGame === 'slots') {
      return (
        <main className="min-h-screen bg-black text-white p-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={backToMenu} className="text-zinc-400 hover:text-white">
              ← Back
            </button>
            <h1 className="text-3xl font-bold">🎰 Slots</h1>
          </div>
          <SlotsGame balance={balance} onSpin={handleSlotsSpin} />
        </main>
      );
    }

    if (casinoGame === 'dice') {
      return (
        <main className="min-h-screen bg-black text-white p-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={backToMenu} className="text-zinc-400 hover:text-white">
              ← Back
            </button>
            <h1 className="text-3xl font-bold">🎲 Dice</h1>
          </div>
          <DiceGame balance={balance} onRoll={handleDiceRoll} />
        </main>
      );
    }

    if (casinoGame === 'roulette') {
      return (
        <main className="min-h-screen bg-black text-white p-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={backToMenu} className="text-zinc-400 hover:text-white">
              ← Back
            </button>
            <h1 className="text-3xl font-bold">🎰 Roulette</h1>
          </div>
          <RouletteGame balance={balance} onSpin={handleRouletteSpin} />
        </main>
      );
    }

    // Mini games
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={backToMenu} className="text-zinc-400 hover:text-white">
            ← Back
          </button>
          <h1 className="text-3xl font-bold">{activeGame.name}</h1>
        </div>

        {activeGame.type === 'clicker' && (
          <div className="text-center">
            <div className="text-6xl font-bold text-green-400 mb-4">{timeLeft}s</div>
            <div className="text-4xl font-bold text-white mb-8">{clicks} clicks</div>
            
            <button
              onClick={handleClick}
              className="w-64 h-64 bg-gradient-to-br from-green-600 to-green-800 rounded-full text-6xl font-bold active:scale-95 transition-transform"
            >
              👆
            </button>
            
            <p className="text-zinc-500 mt-8">Click as fast as you can!</p>
          </div>
        )}

        {activeGame.type === 'guess' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <p className="text-zinc-500 mb-2">Attempts: {attempts}/{maxAttempts}</p>
              <p className="text-zinc-500">
                {guessNumber && (
                  <span className={parseInt(guessNumber) < targetNumber ? 'text-blue-400' : 'text-red-400'}>
                    {parseInt(guessNumber) < targetNumber ? 'Too low!' : 'Too high!'}
                  </span>
                )}
              </p>
            </div>

            <input
              type="number"
              value={guessNumber}
              onChange={(e) => setGuessNumber(e.target.value)}
              placeholder="Enter your guess"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white text-center text-2xl mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
            />

            <button
              onClick={handleGuess}
              className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-4 font-bold text-xl"
            >
              Submit Guess
            </button>
          </div>
        )}

        {activeGame.type === 'arcade' && (
          <div className="text-center py-12">
            <p className="text-zinc-500">Arcade games coming soon!</p>
            <button onClick={backToMenu} className="mt-4 bg-zinc-700 rounded-xl px-6 py-3">
              Back to Menu
            </button>
          </div>
        )}
      </main>
    );
  }

  if (activeGame && gameState === 'result') {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">{(result?.reward || 0) > 0 ? '🎉' : '😢'}</div>
          
          <h2 className="text-3xl font-bold mb-4">
            {(result?.reward || 0) > 0 ? 'You Won!' : 'Game Over'}
          </h2>
          
          <p className="text-zinc-400 mb-6">{result?.message}</p>
          
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-6">
            <p className="text-zinc-500">Reward</p>
            <p className={`text-4xl font-bold ${(result?.reward || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {(result?.reward || 0) > 0 ? '+' : ''}{result?.reward || 0} FREE
            </p>
          </div>

          <button
            onClick={backToMenu}
            className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-4 font-bold text-xl"
          >
            Back to Games
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-purple-400 mb-8">🎮 Games</h1>

      {/* Casino Games */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">🎰 Casino</h2>
        <div className="grid gap-4">
          <div
            className="bg-zinc-950 border border-yellow-600 rounded-3xl p-6 cursor-pointer hover:border-yellow-500 transition"
            onClick={() => startGame({ type: 'casino', gameType: 'slots', name: 'Slots', icon: '🎰' })}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎰</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">Slots</h3>
                <p className="text-zinc-500 text-sm">Match symbols to win up to 25x!</p>
              </div>
              <button className="bg-yellow-600 hover:bg-yellow-500 rounded-xl px-6 py-3 font-bold">
                Play
              </button>
            </div>
          </div>

          <div
            className="bg-zinc-950 border border-blue-600 rounded-3xl p-6 cursor-pointer hover:border-blue-500 transition"
            onClick={() => startGame({ type: 'casino', gameType: 'dice', name: 'Dice', icon: '🎲' })}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎲</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">Dice</h3>
                <p className="text-zinc-500 text-sm">Predict high or low, win 2x!</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 rounded-xl px-6 py-3 font-bold">
                Play
              </button>
            </div>
          </div>

          <div
            className="bg-zinc-950 border border-red-600 rounded-3xl p-6 cursor-pointer hover:border-red-500 transition"
            onClick={() => startGame({ type: 'casino', gameType: 'roulette', name: 'Roulette', icon: '🎰' })}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎰</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">Roulette</h3>
                <p className="text-zinc-500 text-sm">Classic roulette, win up to 35x!</p>
              </div>
              <button className="bg-red-600 hover:bg-red-500 rounded-xl px-6 py-3 font-bold">
                Play
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Games */}
      <div>
        <h2 className="text-2xl font-bold text-green-400 mb-4">🎮 Mini Games</h2>
        <div className="grid gap-4">
          {games.map((game) => {
            const canPlay = game.canPlay;
            const timeUntil = game.last_played ? getTimeUntilPlay(game.last_played, game.cooldown) : '';
            
            return (
              <div
                key={game.id}
                className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{game.icon}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{game.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-zinc-500 text-sm mb-2">{game.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-400">+{game.reward} FREE</span>
                      <span className="text-zinc-500">{game.cooldown}m cooldown</span>
                    </div>
                  </div>

                  <button
                    onClick={() => startGame(game)}
                    disabled={!canPlay || playing}
                    className={`px-6 py-3 rounded-xl font-bold transition ${
                      canPlay
                        ? 'bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700'
                        : 'bg-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    {playing ? '...' : canPlay ? 'Play' : timeUntil}
                  </button>
                </div>
              </div>
            );
          })}

          {games.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-zinc-500">No games available</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
