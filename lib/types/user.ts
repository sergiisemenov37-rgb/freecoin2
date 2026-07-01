export type TelegramUser = {
  id: number;
  first_name?: string;
  username?: string;
};

export type AppUser = {
  telegram_id: string;
  wallet: string;
  free_balance: number;
  tasks_completed: number;
  miner_level: number;
  miner_power: number;
  last_mining?: string;
  banned?: boolean;
  referred_by?: string | null;
  // New fields for enhanced features
  streak?: number;
  last_streak_date?: string;
  guild_id?: string | null;
  reputation_score?: number;
  total_mined?: number;
  created_at?: string;
  vip_level?: number;
};

export type UpgradeResult =
  | { success: false; error: string }
  | {
      success: true;
      level: number;
      power: number;
      balance: number;
    };

// Friends
export interface Friend {
  id: number;
  telegram_id: string;
  friend_telegram_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  friend_info?: {
    username?: string;
    first_name?: string;
  };
}

export interface FriendRequest {
  id: number;
  from_telegram_id: string;
  to_telegram_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  from_user?: {
    username?: string;
    first_name?: string;
  };
}

export interface Message {
  id: number;
  from_telegram_id: string;
  to_telegram_id: string;
  content: string;
  type: string;
  read: boolean;
  created_at: string;
}

// Guilds
export interface Guild {
  id: number;
  name: string;
  description: string;
  emblem: string;
  leader_id: string;
  level: number;
  total_power: number;
  total_balance: number;
  created_at: string;
  member_count?: number;
}

export interface GuildMember {
  id: number;
  guild_id: number;
  telegram_id: string;
  role: 'leader' | 'officer' | 'member';
  contribution: number;
  joined_at: string;
  user_info?: {
    username?: string;
    first_name?: string;
  };
}

export interface GuildMessage {
  id: number;
  guild_id: number;
  from_telegram_id: string;
  content: string;
  type: string;
  created_at: string;
  from_user?: {
    username?: string;
    first_name?: string;
  };
}

// Tournaments
export interface Tournament {
  id: number;
  name: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  prize_pool: number;
  entry_fee: number;
  max_participants: number;
  current_participants: number;
  status: 'upcoming' | 'active' | 'ended';
}

export interface TournamentParticipant {
  id: number;
  tournament_id: number;
  telegram_id: string;
  score: number;
  rank: number;
  joined_at: string;
}

// Games
export interface GameSession {
  id: number;
  telegram_id: string;
  game_id: string;
  score: number;
  reward: number;
  completed: boolean;
  started_at: string;
  completed_at?: string;
}

// Voting
export interface Proposal {
  id: number;
  title: string;
  description: string;
  type: string;
  proposer_id: string;
  proposer_name: string;
  created_at: string;
  ends_at: string;
  status: 'active' | 'ended';
  votes_for: number;
  votes_against: number;
  total_votes: number;
  min_votes_required: number;
  user_vote?: 'for' | 'against';
}

export interface Vote {
  id: number;
  proposal_id: number;
  voter_id: string;
  choice: 'for' | 'against';
  created_at: string;
}

// Shop
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  icon: string;
}

export interface UserPurchase {
  id: number;
  telegram_id: string;
  item_id: string;
  item_type: string;
  price: number;
  purchased_at: string;
}

// Promo Codes
export interface PromoCode {
  id: number;
  code: string;
  reward: number;
  type: string;
  duration: number;
  max_uses: number;
  current_uses: number;
  expires_at: string;
  active: boolean;
}

// Lottery
export interface LotteryDraw {
  id: number;
  draw_date: string;
  prize_pool: number;
  winning_number?: number;
  ticket_price: number;
  total_tickets: number;
  status: 'upcoming' | 'active' | 'ended';
}

export interface LotteryTicket {
  id: number;
  draw_id: number;
  telegram_id: string;
  ticket_number: number;
  purchased_at: string;
  is_winner?: boolean;
}

// Daily Tasks
export interface DailyTask {
  id: number;
  telegram_id: string;
  task_id: string;
  progress: number;
  completed: boolean;
  date: string;
  reward?: number;
  name?: string;
  description?: string;
  target?: number;
}

// Trophies & Achievements
export interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface UserTrophy {
  id: number;
  telegram_id: string;
  trophy_id: string;
  unlocked: boolean;
  unlocked_at?: string;
  trophy_info?: Trophy;
}

export interface UserAchievement {
  id: number;
  telegram_id: string;
  achievement_id: string;
  unlocked: boolean;
  unlocked_at?: string;
  achievement_info?: Achievement;
}

// Reputation
export interface ReputationAction {
  id: number;
  telegram_id: string;
  action: string;
  from_telegram_id: string;
  weight: number;
  created_at: string;
}
