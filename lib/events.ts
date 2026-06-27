export interface GameEvent {
  id: string;
  name: string;
  description: string;
  icon: string;
  startDate: Date;
  endDate: Date;
  bonusMultiplier: number;
  type: 'weekend' | 'holiday' | 'special';
  active: boolean;
}

export function isWeekend(date: Date = new Date()): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday (0) or Saturday (6)
}

export function getWeekendBonus(): number {
  return isWeekend() ? 2.0 : 1.0; // 2x on weekends
}

export function getCurrentEvent(): GameEvent | null {
  const now = new Date();
  
  // Weekend event
  if (isWeekend(now)) {
    const saturday = new Date(now);
    saturday.setDate(now.getDate() - (now.getDay() === 0 ? 1 : 0));
    saturday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
    sunday.setHours(23, 59, 59, 999);
    
    return {
      id: 'weekend',
      name: 'Weekend Bonus',
      description: '2x mining rewards all weekend!',
      icon: '🎉',
      startDate: saturday,
      endDate: sunday,
      bonusMultiplier: 2.0,
      type: 'weekend',
      active: true
    };
  }
  
  // Add more events here (holidays, special events, etc.)
  return null;
}

export function getActiveBonusMultiplier(): number {
  const event = getCurrentEvent();
  if (event && event.active) {
    return event.bonusMultiplier;
  }
  return 1.0;
}

export function formatEventDuration(event: GameEvent): string {
  const now = new Date();
  const diff = event.endDate.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return `${hours}h ${minutes}m`;
}
