export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'mining' | 'referrals' | 'tasks' | 'level';
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

export function generateWeeklyTournament(): Tournament {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + TOURNAMENT_DURATION_DAYS);
  
  return {
    id: `tournament-${Date.now()}`,
    name: 'Weekly Mining Championship',
    description: 'Mine the most FREE this week to win big prizes!',
    type: 'mining',
    startDate,
    endDate,
    prizePool: 50000,
    entryFee: TOURNAMENT_ENTRY_FEE,
    maxParticipants: 1000,
    currentParticipants: 0,
    status: 'upcoming',
    rewards: [
      { rank: '1st', reward: 20000, type: 'free' },
      { rank: '2nd', reward: 10000, type: 'free' },
      { rank: '3rd', reward: 5000, type: 'free' },
      { rank: '4-10', reward: 2000, type: 'free' },
      { rank: '11-50', reward: 500, type: 'free' },
      { rank: '51-100', reward: 250, type: 'free' }
    ]
  };
}

export function calculateTournamentScore(
  type: Tournament['type'],
  balance: number,
  level: number,
  referrals: number,
  tasksCompleted: number
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
