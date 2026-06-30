export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'mining' | 'referrals' | 'tasks' | 'level' | 'casino' | 'games' | 'guild';
  duration: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  prizePool: number;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'active' | 'completed';
  rewards: TournamentReward[];
}

export interface TournamentReward {
  rank: string;
  reward: number;
  type: 'free' | 'badge' | 'skin';
}

export interface TournamentParticipant {
  telegram_id: string;
  username: string;
  tournament_id: string;
  score: number;
  rank: number;
  joined_at: string;
}

export const TOURNAMENT_DURATION_DAYS = 7;
export const TOURNAMENT_ENTRY_FEE = 100;

export function generateDailyTournament(type: Tournament['type']): Tournament {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);
  
  const tournamentConfigs: Record<string, { name: string; description: string; prizePool: number; entryFee: number }> = {
    mining: { name: 'Daily Mining Sprint', description: 'Mine the most FREE in 24 hours!', prizePool: 5000, entryFee: 25 },
    casino: { name: 'Daily Casino Challenge', description: 'Win the most in casino games!', prizePool: 3000, entryFee: 50 },
    games: { name: 'Daily Games Marathon', description: 'Play the most games today!', prizePool: 2000, entryFee: 20 },
    referrals: { name: 'Daily Referral Rush', description: 'Invite the most friends!', prizePool: 4000, entryFee: 0 },
    tasks: { name: 'Daily Task Master', description: 'Complete the most tasks!', prizePool: 2500, entryFee: 15 }
  };
  
  const config = tournamentConfigs[type] || tournamentConfigs.mining;
  
  return {
    id: `tournament-${type}-daily-${Date.now()}`,
    name: config.name,
    description: config.description,
    type,
    duration: 'daily',
    startDate,
    endDate,
    prizePool: config.prizePool,
    entryFee: config.entryFee,
    maxParticipants: 500,
    currentParticipants: 0,
    status: 'upcoming',
    rewards: [
      { rank: '1st', reward: Math.floor(config.prizePool * 0.3), type: 'free' },
      { rank: '2nd', reward: Math.floor(config.prizePool * 0.2), type: 'free' },
      { rank: '3rd', reward: Math.floor(config.prizePool * 0.15), type: 'free' },
      { rank: '4-10', reward: Math.floor(config.prizePool * 0.05), type: 'free' },
      { rank: '11-50', reward: Math.floor(config.prizePool * 0.01), type: 'free' }
    ]
  };
}

export function generateWeeklyTournament(type: Tournament['type'] = 'mining'): Tournament {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + TOURNAMENT_DURATION_DAYS);
  
  const tournamentConfigs: Record<string, { name: string; description: string; prizePool: number; entryFee: number }> = {
    mining: { name: 'Weekly Mining Championship', description: 'Mine the most FREE this week!', prizePool: 50000, entryFee: 100 },
    casino: { name: 'Weekly Casino Masters', description: 'Casino champions compete!', prizePool: 30000, entryFee: 200 },
    games: { name: 'Weekly Gaming Tournament', description: 'Best players compete!', prizePool: 20000, entryFee: 150 },
    referrals: { name: 'Weekly Referral Battle', description: 'Invite the most friends!', prizePool: 40000, entryFee: 0 },
    guild: { name: 'Weekly Guild Wars', description: 'Guilds compete for glory!', prizePool: 60000, entryFee: 500 },
    level: { name: 'Weekly Level Up Challenge', description: 'Reach the highest level!', prizePool: 25000, entryFee: 75 },
    tasks: { name: 'Weekly Task Marathon', description: 'Complete the most tasks!', prizePool: 15000, entryFee: 50 }
  };
  
  const config = tournamentConfigs[type] || tournamentConfigs.mining;
  
  return {
    id: `tournament-${type}-weekly-${Date.now()}`,
    name: config.name,
    description: config.description,
    type,
    duration: 'weekly',
    startDate,
    endDate,
    prizePool: config.prizePool,
    entryFee: config.entryFee,
    maxParticipants: 1000,
    currentParticipants: 0,
    status: 'upcoming',
    rewards: [
      { rank: '1st', reward: Math.floor(config.prizePool * 0.25), type: 'free' },
      { rank: '2nd', reward: Math.floor(config.prizePool * 0.15), type: 'free' },
      { rank: '3rd', reward: Math.floor(config.prizePool * 0.1), type: 'free' },
      { rank: '4-10', reward: Math.floor(config.prizePool * 0.04), type: 'free' },
      { rank: '11-50', reward: Math.floor(config.prizePool * 0.01), type: 'free' },
      { rank: '51-100', reward: Math.floor(config.prizePool * 0.005), type: 'free' }
    ]
  };
}

export function generateMonthlyTournament(type: Tournament['type'] = 'mining'): Tournament {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);
  
  const tournamentConfigs: Record<string, { name: string; description: string; prizePool: number; entryFee: number }> = {
    mining: { name: 'Monthly Mining Grand Prix', description: 'The ultimate mining challenge!', prizePool: 200000, entryFee: 500 },
    casino: { name: 'Monthly Casino Royale', description: 'High stakes casino tournament!', prizePool: 150000, entryFee: 1000 },
    games: { name: 'Monthly Gaming Championship', description: 'Pro gamers compete!', prizePool: 100000, entryFee: 750 },
    referrals: { name: 'Monthly Referral Marathon', description: 'Top referrers win big!', prizePool: 180000, entryFee: 0 },
    guild: { name: 'Monthly Guild Championship', description: 'Guilds battle for supremacy!', prizePool: 250000, entryFee: 2000 }
  };
  
  const config = tournamentConfigs[type] || tournamentConfigs.mining;
  
  return {
    id: `tournament-${type}-monthly-${Date.now()}`,
    name: config.name,
    description: config.description,
    type,
    duration: 'monthly',
    startDate,
    endDate,
    prizePool: config.prizePool,
    entryFee: config.entryFee,
    maxParticipants: 2000,
    currentParticipants: 0,
    status: 'upcoming',
    rewards: [
      { rank: '1st', reward: Math.floor(config.prizePool * 0.2), type: 'free' },
      { rank: '2nd', reward: Math.floor(config.prizePool * 0.12), type: 'free' },
      { rank: '3rd', reward: Math.floor(config.prizePool * 0.08), type: 'free' },
      { rank: '4-10', reward: Math.floor(config.prizePool * 0.03), type: 'free' },
      { rank: '11-50', reward: Math.floor(config.prizePool * 0.008), type: 'free' },
      { rank: '51-100', reward: Math.floor(config.prizePool * 0.004), type: 'free' },
      { rank: '101-500', reward: Math.floor(config.prizePool * 0.001), type: 'free' }
    ]
  };
}

export function calculateTournamentScore(
  type: Tournament['type'],
  balance: number,
  level: number,
  referrals: number,
  tasksCompleted: number,
  casinoWins: number = 0,
  gamesPlayed: number = 0,
  guildScore: number = 0
): number {
  switch (type) {
    case 'mining':
      return balance;
    case 'referrals':
      return referrals * 1000;
    case 'tasks':
      return tasksCompleted * 100;
    case 'level':
      return level * 500;
    case 'casino':
      return casinoWins * 50;
    case 'games':
      return gamesPlayed * 10;
    case 'guild':
      return guildScore;
    default:
      return 0;
  }
}

export function getTournamentRank(participants: TournamentParticipant[], telegramId: string): number {
  const participant = participants.find(p => p.telegram_id === telegramId);
  return participant?.rank || 0;
}

export function getTimeUntilTournamentEnd(tournament: Tournament): string {
  const now = new Date();
  const diff = tournament.endDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

export function canJoinTournament(tournament: Tournament, balance: number): boolean {
  if (tournament.status !== 'upcoming' && tournament.status !== 'active') return false;
  if (tournament.currentParticipants >= tournament.maxParticipants) return false;
  if (balance < tournament.entryFee) return false;
  return true;
}
