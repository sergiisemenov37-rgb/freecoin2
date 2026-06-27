export interface ReputationAction {
  id: string;
  telegram_id: string;
  action: 'helpful' | 'friendly' | 'active' | 'generous' | 'toxic' | 'spam';
  from_telegram_id: string;
  weight: number;
  created_at: string;
}

export interface UserReputation {
  telegram_id: string;
  score: number;
  level: string;
  badges: string[];
  actions_count: number;
}

export const REPUTATION_LEVELS = [
  { name: 'Newcomer', minScore: 0, color: 'text-zinc-400' },
  { name: 'Friendly', minScore: 10, color: 'text-green-400' },
  { name: 'Helpful', minScore: 50, color: 'text-blue-400' },
  { name: 'Respected', minScore: 100, color: 'text-purple-400' },
  { name: 'Trusted', minScore: 250, color: 'text-cyan-400' },
  { name: 'Legendary', minScore: 500, color: 'text-amber-400' },
  { name: 'Icon', minScore: 1000, color: 'text-pink-400' }
];

export const REPUTATION_ACTIONS = {
  helpful: 5,
  friendly: 3,
  active: 2,
  generous: 4,
  toxic: -10,
  spam: -5
};

export function calculateReputationScore(actions: ReputationAction[]): number {
  return actions.reduce((total, action) => total + action.weight, 0);
}

export function getReputationLevel(score: number): typeof REPUTATION_LEVELS[0] {
  let currentLevel = REPUTATION_LEVELS[0];
  
  for (const level of REPUTATION_LEVELS) {
    if (score >= level.minScore) {
      currentLevel = level;
    }
  }
  
  return currentLevel;
}

export function canGiveReputation(lastGivenTime: string | null): boolean {
  if (!lastGivenTime) return true;
  
  const lastTime = new Date(lastGivenTime);
  const now = new Date();
  const diffHours = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);
  
  return diffHours >= 24; // 24 hour cooldown
}

export function getNextReputationLevel(currentScore: number): typeof REPUTATION_LEVELS[0] | null {
  const currentLevel = getReputationLevel(currentScore);
  const currentIndex = REPUTATION_LEVELS.findIndex(l => l.name === currentLevel.name);
  
  if (currentIndex >= REPUTATION_LEVELS.length - 1) return null;
  
  return REPUTATION_LEVELS[currentIndex + 1];
}

export function getReputationBadges(score: number): string[] {
  const badges: string[] = [];
  
  if (score >= 10) badges.push('🌟 Friendly');
  if (score >= 50) badges.push('💎 Helpful');
  if (score >= 100) badges.push('🏆 Respected');
  if (score >= 250) badges.push('👑 Trusted');
  if (score >= 500) badges.push('⭐ Legendary');
  if (score >= 1000) badges.push('🌟 Icon');
  
  return badges;
}
