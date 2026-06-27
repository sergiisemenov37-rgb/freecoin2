export interface StreakInfo {
  currentStreak: number;
  lastMiningDate: string | null;
  bonusMultiplier: number;
  todayBonusClaimed: boolean;
}

export function calculateStreakBonus(streak: number): number {
  // Бонусы за серию: 1.1x, 1.2x, 1.3x, ... макс 2x
  const baseMultiplier = 1.0;
  const bonusPerDay = 0.1;
  const maxMultiplier = 2.0;
  
  const multiplier = Math.min(
    baseMultiplier + (streak * bonusPerDay),
    maxMultiplier
  );
  
  return Number(multiplier.toFixed(2));
}

export function getStreakReward(streak: number): number {
  // Награды за серию: 10, 25, 50, 100, 200, 400, 800, 1600, 3200, 6400
  const baseReward = 10;
  const growthFactor = 1.5;
  
  return Math.floor(baseReward * Math.pow(growthFactor, Math.min(streak - 1, 9)));
}

export function checkStreak(
  lastMiningDate: string | null,
  currentDate: Date = new Date()
): { currentStreak: number; isToday: boolean } {
  if (!lastMiningDate) {
    return { currentStreak: 0, isToday: false };
  }

  const lastDate = new Date(lastMiningDate);
  const diffTime = currentDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Если майнил сегодня
  if (diffDays === 0) {
    return { currentStreak: 0, isToday: true };
  }

  // Если майнил вчера - серия продолжается
  if (diffDays === 1) {
    return { currentStreak: 1, isToday: false };
  }

  // Если прошло больше дня - серия сброшена
  return { currentStreak: 0, isToday: false };
}

export function getStreakMilestone(streak: number): string | null {
  const milestones = {
    3: '🔥 On Fire!',
    7: '⚡ Week Warrior',
    14: '💪 Two Week Strong',
    30: '👑 Monthly Master',
    60: '🏆 Legendary Streak',
    100: '🌟 Immortal Miner'
  };

  return milestones[streak as keyof typeof milestones] || null;
}
