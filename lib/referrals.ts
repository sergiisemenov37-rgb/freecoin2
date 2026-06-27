export interface ReferralBonus {
  level: number;
  bonusPercentage: number;
  name: string;
}

export const referralBonuses: ReferralBonus[] = [
  { level: 1, bonusPercentage: 10, name: 'Bronze' },
  { level: 5, bonusPercentage: 15, name: 'Silver' },
  { level: 10, bonusPercentage: 20, name: 'Gold' },
  { level: 25, bonusPercentage: 25, name: 'Platinum' },
  { level: 50, bonusPercentage: 30, name: 'Diamond' },
  { level: 100, bonusPercentage: 35, name: 'Legendary' }
];

export function getReferralBonus(referralCount: number): number {
  let bonus = 10; // Base 10%
  
  for (const tier of referralBonuses) {
    if (referralCount >= tier.level) {
      bonus = tier.bonusPercentage;
    }
  }
  
  return bonus;
}

export function getReferralTier(referralCount: number): ReferralBonus {
  let currentTier = referralBonuses[0];
  
  for (const tier of referralBonuses) {
    if (referralCount >= tier.level) {
      currentTier = tier;
    }
  }
  
  return currentTier;
}

export function calculateReferralReward(minerPower: number, referralCount: number): number {
  const bonusPercentage = getReferralBonus(referralCount);
  const baseReward = minerPower * 0.1; // 10% of miner's power as base
  return baseReward * (bonusPercentage / 100);
}
