export interface LeaderboardEntry {
  telegram_id: string;
  username: string;
  first_name: string;
  free_balance: number;
  miner_level: number;
  referrals_count: number;
  total_mined: number;
}

export interface LeaderboardFilters {
  type: 'balance' | 'level' | 'referrals' | 'mined';
  period: 'all' | 'week' | 'month';
}

export function getLeaderboardTypeLabel(type: LeaderboardFilters['type']): string {
  const labels = {
    balance: '💰 Balance',
    level: '⛏️ Level',
    referrals: '👥 Referrals',
    mined: '💎 Total Mined'
  };
  return labels[type];
}

export function getPeriodLabel(period: LeaderboardFilters['period']): string {
  const labels = {
    all: 'All Time',
    week: 'This Week',
    month: 'This Month'
  };
  return labels[period];
}

export function getRankIcon(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  if (rank <= 10) return '⭐';
  if (rank <= 50) return '🎯';
  return '•';
}

export function getRankColor(rank: number): string {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-gray-300';
  if (rank === 3) return 'text-orange-400';
  if (rank <= 10) return 'text-green-400';
  if (rank <= 50) return 'text-blue-400';
  return 'text-zinc-400';
}
