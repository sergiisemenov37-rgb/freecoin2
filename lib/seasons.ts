export interface Season {
  id: string;
  name: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  rewards: SeasonReward[];
}

export interface SeasonReward {
  rank: string;
  reward: number;
  type: 'free' | 'nft' | 'badge' | 'exclusive';
}

export interface SeasonProgress {
  telegram_id: string;
  season_id: string;
  points: number;
  rank: number;
  matches_won: number;
  total_matches: number;
}

export const SEASON_DURATION_DAYS = 30;

export function getCurrentSeason(): Season {
  const now = new Date();
  const seasonNumber = Math.floor((now.getTime() - Date.UTC(2024, 0, 1)) / (SEASON_DURATION_DAYS * 24 * 60 * 60 * 1000)) + 1;
  
  const startDate = new Date(Date.UTC(2024, 0, 1) + (seasonNumber - 1) * SEASON_DURATION_DAYS * 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + SEASON_DURATION_DAYS * 24 * 60 * 60 * 1000);
  
  const themes = [
    'Genesis', 'Ice Age', 'Fire Storm', 'Golden Era', 
    'Cyberpunk', 'Ancient Legends', 'Future Tech', 'Cosmic'
  ];
  
  const theme = themes[(seasonNumber - 1) % themes.length];
  
  return {
    id: `season-${seasonNumber}`,
    name: `Season ${seasonNumber}: ${theme}`,
    theme,
    startDate,
    endDate,
    status: now >= startDate && now < endDate ? 'active' : now < startDate ? 'upcoming' : 'completed',
    rewards: generateSeasonRewards()
  };
}

export function generateSeasonRewards(): SeasonReward[] {
  return [
    { rank: '1st', reward: 100000, type: 'free' },
    { rank: '2nd', reward: 50000, type: 'free' },
    { rank: '3rd', reward: 25000, type: 'free' },
    { rank: '4-10', reward: 10000, type: 'free' },
    { rank: '11-50', reward: 5000, type: 'free' },
    { rank: '51-100', reward: 2500, type: 'free' },
    { rank: '101-500', reward: 1000, type: 'free' },
    { rank: '500+', reward: 500, type: 'badge' }
  ];
}

export function calculateSeasonPoints(
  balance: number,
  level: number,
  referrals: number,
  tasksCompleted: number
): number {
  const balancePoints = Math.floor(balance / 100);
  const levelPoints = level * 50;
  const referralPoints = referrals * 200;
  const taskPoints = tasksCompleted * 10;
  
  return balancePoints + levelPoints + referralPoints + taskPoints;
}

export function getSeasonRank(points: number, totalPlayers: number): number {
  // Simplified rank calculation - in real app, this would query database
  const estimatedRank = Math.max(1, Math.floor(totalPlayers * (1 - points / 10000)));
  return estimatedRank;
}

export function getTimeUntilSeasonEnd(): string {
  const season = getCurrentSeason();
  const now = new Date();
  const diff = season.endDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Season ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

export function getSeasonProgress(): number {
  const season = getCurrentSeason();
  const now = new Date();
  const totalDuration = season.endDate.getTime() - season.startDate.getTime();
  const elapsed = now.getTime() - season.startDate.getTime();
  
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
}
