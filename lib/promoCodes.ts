export interface PromoCode {
  code: string;
  reward: number;
  type: 'balance' | 'mining_boost' | 'ticket_discount';
  duration?: number; // for boosts in days
  maxUses: number;
  currentUses: number;
  expiresAt: Date;
  active: boolean;
}

export function validatePromoCode(code: string, promoCodes: PromoCode[]): PromoCode | null {
  const promo = promoCodes.find(p => p.code.toLowerCase() === code.toLowerCase());
  
  if (!promo || !promo.active) {
    return null;
  }
  
  if (new Date() > promo.expiresAt) {
    return null;
  }
  
  if (promo.currentUses >= promo.maxUses) {
    return null;
  }
  
  return promo;
}

export function applyPromoCode(promo: PromoCode, telegramId: string): {
  success: boolean;
  reward: number;
  message: string;
  type: PromoCode['type'];
} {
  if (promo.currentUses >= promo.maxUses) {
    return {
      success: false,
      reward: 0,
      message: 'Promo code has reached maximum uses',
      type: promo.type
    };
  }
  
  promo.currentUses++;
  
  return {
    success: true,
    reward: promo.reward,
    message: `Promo code applied! +${promo.reward} ${promo.type === 'balance' ? 'FREE' : 'bonus'}`,
    type: promo.type
  };
}

// Sample promo codes (in real app, these would be in database)
export const samplePromoCodes: PromoCode[] = [
  {
    code: 'START100',
    reward: 100,
    type: 'balance',
    maxUses: 10000,
    currentUses: 0,
    expiresAt: new Date('2025-12-31'),
    active: true
  },
  {
    code: 'BOOST50',
    reward: 50,
    type: 'mining_boost',
    duration: 3,
    maxUses: 5000,
    currentUses: 0,
    expiresAt: new Date('2025-12-31'),
    active: true
  },
  {
    code: 'WEEKEND',
    reward: 25,
    type: 'ticket_discount',
    maxUses: 1000,
    currentUses: 0,
    expiresAt: new Date('2025-12-31'),
    active: true
  }
];
