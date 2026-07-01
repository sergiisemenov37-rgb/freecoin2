export interface StarsProduct {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  reward: {
    free: number;
    badge?: string;
    effect?: {
      type: string;
      value: number;
      duration?: number;
    };
  };
}

export const starsProducts: StarsProduct[] = [
  {
    id: 'stars_starter_pack',
    name: 'Starter Pack',
    description: '1000 FREE + Mining Boost (1h)',
    icon: '🌟',
    price: 25,
    reward: {
      free: 1000,
      effect: {
        type: 'mining_boost',
        value: 0.5,
        duration: 3600
      }
    }
  },
  {
    id: 'stars_premium_pack',
    name: 'Premium Pack',
    description: '5000 FREE + Exclusive Badge',
    icon: '⭐',
    price: 100,
    reward: {
      free: 5000,
      badge: 'premium_supporter'
    }
  },
  {
    id: 'stars_mega_pack',
    name: 'MEGA Pack',
    description: '15000 FREE + Legendary Badge',
    icon: '💎',
    price: 250,
    reward: {
      free: 15000,
      badge: 'mega_whale'
    }
  }
];

export function getStarsProduct(id: string): StarsProduct | undefined {
  return starsProducts.find(p => p.id === id);
}

export function createStarsInvoiceLink(productId: string, telegramId: string): string {
  const product = getStarsProduct(productId);
  if (!product) return '';
  
  // This would typically use Telegram Bot API to create an invoice
  // For now, return a placeholder link
  return `https://t.me/freecoinweb3?start=stars_${productId}_${telegramId}`;
}
