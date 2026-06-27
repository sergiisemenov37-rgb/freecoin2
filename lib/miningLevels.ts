export interface MiningLevel {
  level: number;
  power: number;
  price: number;
  name: string;
  multiplier: number;
}

// Генерация 100 уровней с экспоненциальным ростом
export function generateMiningLevels(): MiningLevel[] {
  const levels: MiningLevel[] = [];
  
  const tierNames = [
    "Starter", "Basic", "Standard", "Advanced", "Pro",
    "Elite", "Master", "Grandmaster", "Legend", "Mythic"
  ];
  
  for (let i = 1; i <= 100; i++) {
    const tierIndex = Math.min(Math.floor((i - 1) / 10), 9);
    const tierName = tierNames[tierIndex];
    
    // Экспоненциальный рост мощности
    const basePower = 0.2;
    const powerGrowth = 1.15; // 15% рост на уровень
    const power = basePower * Math.pow(powerGrowth, i - 1);
    
    // Экспоненциальный рост цены
    const basePrice = 100;
    const priceGrowth = 1.25; // 25% рост на уровень
    const price = Math.floor(basePrice * Math.pow(priceGrowth, i - 1));
    
    // Множитель для бонусов
    const multiplier = 1 + (i - 1) * 0.05; // 5% бонус на уровень
    
    levels.push({
      level: i,
      power: Number(power.toFixed(3)),
      price,
      name: `${tierName} Miner LVL ${i}`,
      multiplier: Number(multiplier.toFixed(2))
    });
  }
  
  return levels;
}

export const miningLevels = generateMiningLevels();

export function getLevelInfo(level: number): MiningLevel {
  return miningLevels[level - 1] || miningLevels[0];
}

export function getNextLevel(level: number): MiningLevel | null {
  if (level >= 100) return null;
  return miningLevels[level];
}

export function getMaxLevel(): number {
  return 100;
}
