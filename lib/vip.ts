export interface VIPStatus {
  level: number;
  name: string;
  icon: string;
  color: string;
  requirement: number; // minimum balance or level
  miningBonus: number;
  referralBonus: number;
  taskBonus: number;
  lotteryDiscount: number;
  exclusiveFeatures: string[];
}

export const vipLevels: VIPStatus[] = [
  {
    level: 0,
    name: 'Standard',
    icon: '👤',
    color: 'text-zinc-400',
    requirement: 0,
    miningBonus: 0,
    referralBonus: 0,
    taskBonus: 0,
    lotteryDiscount: 0,
    exclusiveFeatures: []
  },
  {
    level: 1,
    name: 'Bronze',
    icon: '🥉',
    color: 'text-orange-400',
    requirement: 1000,
    miningBonus: 0.05,
    referralBonus: 0.02,
    taskBonus: 0.05,
    lotteryDiscount: 0.05,
    exclusiveFeatures: ['Bronze badge', 'Priority support']
  },
  {
    level: 2,
    name: 'Silver',
    icon: '🥈',
    color: 'text-gray-300',
    requirement: 5000,
    miningBonus: 0.10,
    referralBonus: 0.05,
    taskBonus: 0.10,
    lotteryDiscount: 0.10,
    exclusiveFeatures: ['Silver badge', 'Priority support', 'Exclusive tasks']
  },
  {
    level: 3,
    name: 'Gold',
    icon: '🥇',
    color: 'text-yellow-400',
    requirement: 25000,
    miningBonus: 0.15,
    referralBonus: 0.10,
    taskBonus: 0.15,
    lotteryDiscount: 0.15,
    exclusiveFeatures: ['Gold badge', 'VIP support', 'Exclusive tasks', 'Daily bonus']
  },
  {
    level: 4,
    name: 'Platinum',
    icon: '💎',
    color: 'text-cyan-400',
    requirement: 100000,
    miningBonus: 0.25,
    referralBonus: 0.15,
    taskBonus: 0.25,
    lotteryDiscount: 0.25,
    exclusiveFeatures: ['Platinum badge', '24/7 support', 'Exclusive tasks', 'Daily bonus', 'Weekly bonus']
  },
  {
    level: 5,
    name: 'Diamond',
    icon: '💠',
    color: 'text-purple-400',
    requirement: 500000,
    miningBonus: 0.35,
    referralBonus: 0.20,
    taskBonus: 0.35,
    lotteryDiscount: 0.35,
    exclusiveFeatures: ['Diamond badge', 'Personal manager', 'Exclusive tasks', 'Daily bonus', 'Weekly bonus', 'Monthly bonus']
  },
  {
    level: 6,
    name: 'Legendary',
    icon: '👑',
    color: 'text-amber-400',
    requirement: 1000000,
    miningBonus: 0.50,
    referralBonus: 0.30,
    taskBonus: 0.50,
    lotteryDiscount: 0.50,
    exclusiveFeatures: ['Legendary badge', 'Personal manager', 'Exclusive tasks', 'Daily bonus', 'Weekly bonus', 'Monthly bonus', 'Exclusive events']
  }
];

export function getVIPStatus(balance: number, level: number): VIPStatus {
  // VIP status is based on higher of balance or miner level
  const levelRequirement = level * 1000; // Each level = 1000 FREE equivalent
  const effectiveValue = Math.max(balance, levelRequirement);
  
  let currentVIP = vipLevels[0];
  
  for (const vip of vipLevels) {
    if (effectiveValue >= vip.requirement) {
      currentVIP = vip;
    }
  }
  
  return currentVIP;
}

export function getNextVIPRequirement(currentVIP: VIPStatus): number {
  const nextIndex = currentVIP.level + 1;
  if (nextIndex >= vipLevels.length) return -1; // Max level
  return vipLevels[nextIndex].requirement;
}

export function applyVIPMiningBonus(basePower: number, vip: VIPStatus): number {
  return basePower * (1 + vip.miningBonus);
}

export function applyVIPReferralBonus(baseBonus: number, vip: VIPStatus): number {
  return baseBonus * (1 + vip.referralBonus);
}

export function applyVIPTaskReward(baseReward: number, vip: VIPStatus): number {
  return baseReward * (1 + vip.taskBonus);
}

export function getLotteryTicketPrice(vip: VIPStatus): number {
  const basePrice = 50;
  return Math.floor(basePrice * (1 - vip.lotteryDiscount));
}
