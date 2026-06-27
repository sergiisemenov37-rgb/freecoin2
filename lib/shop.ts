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
    type: 'mining_bonus' | 'referral_bonus' | 'task_bonus';
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
