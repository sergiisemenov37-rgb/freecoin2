// Casino types
export interface BlackjackHand {
  cards: BlackjackCard[];
  value: number;
  isBust: boolean;
}

export interface BlackjackCard {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
}

export interface BlackjackGame {
  id: string;
  player_id: string;
  player_hand: BlackjackHand;
  dealer_hand: BlackjackHand;
  bet: number;
  status: 'active' | 'player_bust' | 'dealer_bust' | 'player_win' | 'dealer_win' | 'push';
  winnings: number;
  created_at: string;
  completed_at?: string;
}

export interface CasinoStats {
  total_games: number;
  wins: number;
  losses: number;
  total_wagered: number;
  total_winnings: number;
  current_streak: number;
  best_streak: number;
}

export interface CasinoTransaction {
  id: number;
  user_id: string;
  type: 'bet' | 'win' | 'loss';
  amount: number;
  game_type: string;
  created_at: string;
}
