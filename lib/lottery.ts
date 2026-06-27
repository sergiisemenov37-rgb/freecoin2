export interface LotteryTicket {
  id: string;
  telegram_id: string;
  ticket_number: number;
  draw_date: string;
}

export interface LotteryDraw {
  id: string;
  draw_date: string;
  prize_pool: number;
  winning_number: number | null;
  winners: LotteryWinner[];
  ticket_price: number;
  total_tickets: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface LotteryWinner {
  telegram_id: string;
  username: string;
  prize: number;
  ticket_number: number;
}

export const TICKET_PRICE = 50; // FREE
export const DRAW_INTERVAL_HOURS = 24; // Daily draws

export function generateTicketNumber(): number {
  return Math.floor(Math.random() * 10000) + 1;
}

export function calculatePrizePool(totalTickets: number): number {
  // 70% of ticket sales goes to prize pool
  return Math.floor(totalTickets * TICKET_PRICE * 0.7);
}

export function calculatePrize(rank: number, prizePool: number): number {
  const prizeDistribution = [
    0.50, // 1st place: 50%
    0.25, // 2nd place: 25%
    0.15, // 3rd place: 15%
    0.05, // 4th place: 5%
    0.03, // 5th place: 3%
    0.02, // 6th-10th: 2% each
  ];

  if (rank <= 5) {
    return Math.floor(prizePool * prizeDistribution[rank - 1]);
  }
  
  if (rank <= 10) {
    return Math.floor(prizePool * prizeDistribution[5]);
  }

  return 0;
}

export function getNextDrawTime(): Date {
  const now = new Date();
  const nextDraw = new Date(now);
  nextDraw.setHours(nextDraw.getHours() + DRAW_INTERVAL_HOURS);
  return nextDraw;
}

export function getTimeUntilDraw(): string {
  const nextDraw = getNextDrawTime();
  const now = new Date();
  const diff = nextDraw.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

export function getWinningChance(ticketsOwned: number, totalTickets: number): number {
  if (totalTickets === 0) return 0;
  return (ticketsOwned / totalTickets) * 100;
}
