export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  reward: number;
  type: 'level' | 'balance' | 'referrals' | 'tasks' | 'streak';
}

export const achievements: Achievement[] = [
  // Level achievements
  {
    id: 'first_upgrade',
    name: 'First Steps',
    description: 'Upgrade your miner to level 2',
    icon: '🚀',
    requirement: 2,
    reward: 50,
    type: 'level'
  },
  {
    id: 'novice_miner',
    name: 'Novice Miner',
    description: 'Reach level 10',
    icon: '⛏️',
    requirement: 10,
    reward: 200,
    type: 'level'
  },
  {
    id: 'pro_miner',
    name: 'Pro Miner',
    description: 'Reach level 25',
    icon: '💎',
    requirement: 25,
    reward: 1000,
    type: 'level'
  },
  {
    id: 'elite_miner',
    name: 'Elite Miner',
    description: 'Reach level 50',
    icon: '👑',
    requirement: 50,
    reward: 5000,
    type: 'level'
  },
  {
    id: 'legend_miner',
    name: 'Legendary Miner',
    description: 'Reach level 75',
    icon: '🏆',
    requirement: 75,
    reward: 25000,
    type: 'level'
  },
  {
    id: 'mythic_miner',
    name: 'Mythic Miner',
    description: 'Reach level 100',
    icon: '🌟',
    requirement: 100,
    reward: 100000,
    type: 'level'
  },
  
  // Balance achievements
  {
    id: 'first_free',
    name: 'First FREE',
    description: 'Earn 100 FREE',
    icon: '💰',
    requirement: 100,
    reward: 10,
    type: 'balance'
  },
  {
    id: 'thousand_free',
    name: 'Thousand FREE',
    description: 'Earn 1,000 FREE',
    icon: '💵',
    requirement: 1000,
    reward: 100,
    type: 'balance'
  },
  {
    id: 'ten_k_free',
    name: 'Ten Thousand FREE',
    description: 'Earn 10,000 FREE',
    icon: '💎',
    requirement: 10000,
    reward: 500,
    type: 'balance'
  },
  {
    id: 'hundred_k_free',
    name: 'Hundred Thousand FREE',
    description: 'Earn 100,000 FREE',
    icon: '🏦',
    requirement: 100000,
    reward: 5000,
    type: 'balance'
  },
  
  // Referral achievements
  {
    id: 'first_referral',
    name: 'First Friend',
    description: 'Invite your first friend',
    icon: '👋',
    requirement: 1,
    reward: 100,
    type: 'referrals'
  },
  {
    id: 'five_referrals',
    name: 'Squad Leader',
    description: 'Invite 5 friends',
    icon: '👥',
    requirement: 5,
    reward: 500,
    type: 'referrals'
  },
  {
    id: 'ten_referrals',
    name: 'Community Builder',
    description: 'Invite 10 friends',
    icon: '🌐',
    requirement: 10,
    reward: 1500,
    type: 'referrals'
  },
  {
    id: 'fifty_referrals',
    name: 'Influencer',
    description: 'Invite 50 friends',
    icon: '📢',
    requirement: 50,
    reward: 10000,
    type: 'referrals'
  },
  
  // Task achievements
  {
    id: 'first_task',
    name: 'Task Master',
    description: 'Complete your first task',
    icon: '✅',
    requirement: 1,
    reward: 25,
    type: 'tasks'
  },
  {
    id: 'ten_tasks',
    name: 'Task Hunter',
    description: 'Complete 10 tasks',
    icon: '🎯',
    requirement: 10,
    reward: 200,
    type: 'tasks'
  },
  {
    id: 'fifty_tasks',
    name: 'Task Champion',
    description: 'Complete 50 tasks',
    icon: '🏅',
    requirement: 50,
    reward: 1000,
    type: 'tasks'
  },
  
  // Streak achievements
  {
    id: 'three_day_streak',
    name: 'Consistent Miner',
    description: '3 day mining streak',
    icon: '🔥',
    requirement: 3,
    reward: 150,
    type: 'streak'
  },
  {
    id: 'seven_day_streak',
    name: 'Week Warrior',
    description: '7 day mining streak',
    icon: '⚡',
    requirement: 7,
    reward: 500,
    type: 'streak'
  },
  {
    id: 'thirty_day_streak',
    name: 'Monthly Master',
    description: '30 day mining streak',
    icon: '👑',
    requirement: 30,
    reward: 3000,
    type: 'streak'
  }
];

export function getAchievementsByType(type: Achievement['type']): Achievement[] {
  return achievements.filter(a => a.type === type);
}

export function checkAchievement(
  type: Achievement['type'],
  currentValue: number
): Achievement[] {
  return achievements.filter(
    a => a.type === type && currentValue >= a.requirement
  );
}
