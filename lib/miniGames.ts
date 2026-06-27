export interface MiniGame {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'clicker' | 'guess' | 'arcade';
  reward: number;
  cooldown: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameSession {
  id: string;
  telegram_id: string;
  game_id: string;
  score: number;
  reward: number;
  completed: boolean;
  started_at: string;
  completed_at?: string;
}

export const miniGames: MiniGame[] = [
  {
    id: 'clicker_basic',
    name: 'Speed Clicker',
    description: 'Click as fast as you can in 10 seconds!',
    icon: '👆',
    type: 'clicker',
    reward: 25,
    cooldown: 30,
    difficulty: 'easy'
  },
  {
    id: 'clicker_pro',
    name: 'Pro Clicker',
    description: 'Click as fast as you can in 5 seconds!',
    icon: '⚡',
    type: 'clicker',
    reward: 50,
    cooldown: 60,
    difficulty: 'medium'
  },
  {
    id: 'guess_number',
    name: 'Guess the Number',
    description: 'Guess a number between 1-100',
    icon: '🔢',
    type: 'guess',
    reward: 40,
    cooldown: 45,
    difficulty: 'easy'
  },
  {
    id: 'guess_number_hard',
    name: 'Number Master',
    description: 'Guess a number between 1-1000',
    icon: '🎯',
    type: 'guess',
    reward: 100,
    cooldown: 90,
    difficulty: 'hard'
  },
  {
    id: 'memory_match',
    name: 'Memory Match',
    description: 'Match pairs of cards',
    icon: '🃏',
    type: 'arcade',
    reward: 75,
    cooldown: 60,
    difficulty: 'medium'
  },
  {
    id: 'reaction_time',
    name: 'Reaction Time',
    description: 'Test your reflexes',
    icon: '⏱️',
    type: 'arcade',
    reward: 30,
    cooldown: 20,
    difficulty: 'easy'
  }
];

export function calculateClickerReward(clicks: number, duration: number): number {
  const baseReward = 25;
  const clicksPerSecond = clicks / duration;
  const bonus = Math.min(clicksPerSecond * 2, 50); // Max 50 bonus
  return Math.floor(baseReward + bonus);
}

export function calculateGuessReward(attempts: number, maxAttempts: number): number {
  const baseReward = 40;
  const attemptsBonus = (maxAttempts - attempts) * 5;
  return Math.floor(baseReward + attemptsBonus);
}

export function getDifficultyColor(difficulty: MiniGame['difficulty']): string {
  const colors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400'
  };
  return colors[difficulty];
}

export function canPlayGame(lastPlayed: string | null, cooldown: number): boolean {
  if (!lastPlayed) return true;
  
  const lastTime = new Date(lastPlayed);
  const now = new Date();
  const diffMinutes = (now.getTime() - lastTime.getTime()) / (1000 * 60);
  
  return diffMinutes >= cooldown;
}

export function getTimeUntilPlay(lastPlayed: string | null, cooldown: number): string {
  if (!lastPlayed) return 'Ready';
  
  const lastTime = new Date(lastPlayed);
  const now = new Date();
  const diffMinutes = (now.getTime() - lastTime.getTime()) / (1000 * 60);
  const remaining = Math.ceil(cooldown - diffMinutes);
  
  if (remaining <= 0) return 'Ready';
  return `${remaining}m`;
}
