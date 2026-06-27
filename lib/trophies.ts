export interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'mining' | 'social' | 'achievement' | 'special';
  requirement: string;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface Medal {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'gold' | 'silver' | 'bronze';
  season: string;
  earned: boolean;
  earned_at?: string;
}

export const TROPHIES: Trophy[] = [
  // Mining Trophies
  {
    id: 'first_mine',
    name: 'First Steps',
    description: 'Mine your first FREE',
    icon: '🎖️',
    rarity: 'common',
    category: 'mining',
    requirement: 'Mine 1 FREE',
    unlocked: false
  },
  {
    id: 'mining_master',
    name: 'Mining Master',
    description: 'Mine 10,000 FREE',
    icon: '⛏️',
    rarity: 'rare',
    category: 'mining',
    requirement: 'Mine 10,000 FREE',
    unlocked: false
  },
  {
    id: 'mining_legend',
    name: 'Mining Legend',
    description: 'Mine 1,000,000 FREE',
    icon: '👑',
    rarity: 'legendary',
    category: 'mining',
    requirement: 'Mine 1,000,000 FREE',
    unlocked: false
  },
  
  // Social Trophies
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Add 10 friends',
    icon: '🦋',
    rarity: 'common',
    category: 'social',
    requirement: 'Add 10 friends',
    unlocked: false
  },
  {
    id: 'community_leader',
    name: 'Community Leader',
    description: 'Have 50 friends',
    icon: '👥',
    rarity: 'epic',
    category: 'social',
    requirement: 'Have 50 friends',
    unlocked: false
  },
  
  // Achievement Trophies
  {
    id: 'achievement_10',
    name: 'Achievement Hunter',
    description: 'Unlock 10 achievements',
    icon: '🏅',
    rarity: 'rare',
    category: 'achievement',
    requirement: 'Unlock 10 achievements',
    unlocked: false
  },
  {
    id: 'achievement_all',
    name: 'Completionist',
    description: 'Unlock all achievements',
    icon: '💎',
    rarity: 'legendary',
    category: 'achievement',
    requirement: 'Unlock all achievements',
    unlocked: false
  },
  
  // Special Trophies
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Joined in the first month',
    icon: '🌟',
    rarity: 'epic',
    category: 'special',
    requirement: 'Joined before [date]',
    unlocked: false
  },
  {
    id: 'tournament_winner',
    name: 'Champion',
    description: 'Win a tournament',
    icon: '🏆',
    rarity: 'legendary',
    category: 'special',
    requirement: 'Win a tournament',
    unlocked: false
  }
];

export function getTrophyRarityColor(rarity: Trophy['rarity']): string {
  const colors = {
    common: 'text-zinc-400 border-zinc-600',
    rare: 'text-blue-400 border-blue-600',
    epic: 'text-purple-400 border-purple-600',
    legendary: 'text-amber-400 border-amber-600'
  };
  return colors[rarity];
}

export function getTrophyCategoryIcon(category: Trophy['category']): string {
  const icons = {
    mining: '⛏️',
    social: '👥',
    achievement: '🏅',
    special: '⭐'
  };
  return icons[category];
}

export function filterTrophiesByCategory(trophies: Trophy[], category: Trophy['category']): Trophy[] {
  return trophies.filter(t => t.category === category);
}

export function filterTrophiesByRarity(trophies: Trophy[], rarity: Trophy['rarity']): Trophy[] {
  return trophies.filter(t => t.rarity === rarity);
}

export function getUnlockedTrophiesCount(trophies: Trophy[]): number {
  return trophies.filter(t => t.unlocked).length;
}

export function generateSeasonMedal(season: string, rank: number): Medal {
  let type: 'gold' | 'silver' | 'bronze';
  
  if (rank === 1) type = 'gold';
  else if (rank <= 3) type = 'silver';
  else if (rank <= 10) type = 'bronze';
  else return null as any;
  
  return {
    id: `medal-${season}-${type}`,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Medal`,
    description: `Finished ${rank}${getOrdinalSuffix(rank)} in ${season}`,
    icon: type === 'gold' ? '🥇' : type === 'silver' ? '🥈' : '🥉',
    type,
    season,
    earned: true,
    earned_at: new Date().toISOString()
  };
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
