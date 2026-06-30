export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  type: 'skin' | 'badge' | 'effect' | 'boost';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  duration?: number; // in days for temporary items
  effect?: {
    type: 'mining_bonus' | 'referral_bonus' | 'task_bonus' | 'casino_bonus' | 'streak_protection';
    value: number;
  };
}

export const shopItems: ShopItem[] = [
  // Skins
  {
    id: 'skin_gold',
    name: 'Gold Miner Skin',
    description: 'Exclusive golden appearance for your miner',
    icon: '⛏️',
    price: 5000,
    type: 'skin',
    rarity: 'rare'
  },
  {
    id: 'skin_diamond',
    name: 'Diamond Miner Skin',
    description: 'Premium diamond appearance',
    icon: '💎',
    price: 25000,
    type: 'skin',
    rarity: 'epic'
  },
  {
    id: 'skin_rainbow',
    name: 'Rainbow Miner Skin',
    description: 'Legendary rainbow effect',
    icon: '🌈',
    price: 100000,
    type: 'skin',
    rarity: 'legendary'
  },
  {
    id: 'skin_neon',
    name: 'Neon Miner Skin',
    description: 'Cyberpunk neon glow effect',
    icon: '💜',
    price: 15000,
    type: 'skin',
    rarity: 'epic'
  },
  {
    id: 'skin_fire',
    name: 'Fire Miner Skin',
    description: 'Burning hot appearance',
    icon: '🔥',
    price: 30000,
    type: 'skin',
    rarity: 'epic'
  },
  {
    id: 'skin_ice',
    name: 'Ice Miner Skin',
    description: 'Cool frozen appearance',
    icon: '❄️',
    price: 20000,
    type: 'skin',
    rarity: 'rare'
  },
  
  // Badges
  {
    id: 'badge_early_adopter',
    name: 'Early Adopter Badge',
    description: 'Show you were here from the start',
    icon: '🎖️',
    price: 1000,
    type: 'badge',
    rarity: 'rare'
  },
  {
    id: 'badge_whale',
    name: 'Whale Badge',
    description: 'For big spenders',
    icon: '🐋',
    price: 50000,
    type: 'badge',
    rarity: 'legendary'
  },
  {
    id: 'badge_lucky',
    name: 'Lucky Badge',
    description: 'For lottery winners',
    icon: '🍀',
    price: 2500,
    type: 'badge',
    rarity: 'epic'
  },
  {
    id: 'badge_champion',
    name: 'Champion Badge',
    description: 'For tournament winners',
    icon: '🏆',
    price: 10000,
    type: 'badge',
    rarity: 'epic'
  },
  {
    id: 'badge_miner',
    name: 'Master Miner Badge',
    description: 'For reaching level 50',
    icon: '⛏️',
    price: 7500,
    type: 'badge',
    rarity: 'rare'
  },
  {
    id: 'badge_social',
    name: 'Social Butterfly Badge',
    description: 'For having 50 friends',
    icon: '🦋',
    price: 3000,
    type: 'badge',
    rarity: 'rare'
  },
  {
    id: 'badge_guild',
    name: 'Guild Master Badge',
    description: 'For guild leaders',
    icon: '🏰',
    price: 15000,
    type: 'badge',
    rarity: 'epic'
  },
  {
    id: 'badge_streak',
    name: 'Streak Master Badge',
    description: 'For 30-day streak',
    icon: '🔥',
    price: 5000,
    type: 'badge',
    rarity: 'rare'
  },
  
  // Effects
  {
    id: 'boost_mining_1day',
    name: 'Mining Boost (1 Day)',
    description: '+50% mining speed for 24 hours',
    icon: '⚡',
    price: 500,
    type: 'effect',
    rarity: 'common',
    duration: 1,
    effect: {
      type: 'mining_bonus',
      value: 0.5
    }
  },
  {
    id: 'boost_mining_7days',
    name: 'Mining Boost (7 Days)',
    description: '+50% mining speed for 7 days',
    icon: '⚡',
    price: 3000,
    type: 'effect',
    rarity: 'rare',
    duration: 7,
    effect: {
      type: 'mining_bonus',
      value: 0.5
    }
  },
  {
    id: 'boost_mining_30days',
    name: 'Mining Boost (30 Days)',
    description: '+100% mining speed for 30 days',
    icon: '⚡',
    price: 10000,
    type: 'effect',
    rarity: 'epic',
    duration: 30,
    effect: {
      type: 'mining_bonus',
      value: 1.0
    }
  },
  {
    id: 'boost_referral_7days',
    name: 'Referral Boost (7 Days)',
    description: '+25% referral rewards for 7 days',
    icon: '👥',
    price: 2000,
    type: 'effect',
    rarity: 'rare',
    duration: 7,
    effect: {
      type: 'referral_bonus',
      value: 0.25
    }
  },
  {
    id: 'boost_referral_30days',
    name: 'Referral Boost (30 Days)',
    description: '+50% referral rewards for 30 days',
    icon: '👥',
    price: 8000,
    type: 'effect',
    rarity: 'epic',
    duration: 30,
    effect: {
      type: 'referral_bonus',
      value: 0.5
    }
  },
  {
    id: 'boost_task_3days',
    name: 'Task Boost (3 Days)',
    description: '+30% task rewards for 3 days',
    icon: '📋',
    price: 1000,
    type: 'effect',
    rarity: 'common',
    duration: 3,
    effect: {
      type: 'task_bonus',
      value: 0.3
    }
  },
  {
    id: 'boost_task_14days',
    name: 'Task Boost (14 Days)',
    description: '+50% task rewards for 14 days',
    icon: '📋',
    price: 4000,
    type: 'effect',
    rarity: 'rare',
    duration: 14,
    effect: {
      type: 'task_bonus',
      value: 0.5
    }
  },
  {
    id: 'boost_casino_1day',
    name: 'Casino Luck (1 Day)',
    description: '+10% casino win chance for 24 hours',
    icon: '🎰',
    price: 750,
    type: 'effect',
    rarity: 'common',
    duration: 1,
    effect: {
      type: 'casino_bonus',
      value: 0.1
    }
  },
  {
    id: 'boost_casino_7days',
    name: 'Casino Luck (7 Days)',
    description: '+15% casino win chance for 7 days',
    icon: '🎰',
    price: 4000,
    type: 'effect',
    rarity: 'rare',
    duration: 7,
    effect: {
      type: 'casino_bonus',
      value: 0.15
    }
  },
  {
    id: 'boost_streak_protection',
    name: 'Streak Protection (7 Days)',
    description: 'Protect your streak for 7 days',
    icon: '🛡️',
    price: 1500,
    type: 'effect',
    rarity: 'rare',
    duration: 7,
    effect: {
      type: 'streak_protection',
      value: 1
    }
  }
];

export function getRarityColor(rarity: ShopItem['rarity']): string {
  const colors = {
    common: 'text-zinc-400 border-zinc-600',
    rare: 'text-blue-400 border-blue-600',
    epic: 'text-purple-400 border-purple-600',
    legendary: 'text-amber-400 border-amber-600'
  };
  return colors[rarity];
}

export function getRarityLabel(rarity: ShopItem['rarity']): string {
  const labels = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary'
  };
  return labels[rarity];
}

export function filterShopByType(items: ShopItem[], type: ShopItem['type']): ShopItem[] {
  return items.filter(item => item.type === type);
}

export function filterShopByRarity(items: ShopItem[], rarity: ShopItem['rarity']): ShopItem[] {
  return items.filter(item => item.rarity === rarity);
}
