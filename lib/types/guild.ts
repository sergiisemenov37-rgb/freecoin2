// Guild extended types
export interface GuildRole {
  name: 'leader' | 'officer' | 'treasurer' | 'member';
  permissions: string[];
}

export interface GuildStats {
  total_members: number;
  total_power: number;
  total_balance: number;
  average_level: number;
  daily_earnings: number;
  weekly_earnings: number;
}

export interface GuildEvent {
  id: number;
  guild_id: number;
  type: 'member_joined' | 'member_left' | 'level_up' | 'achievement' | 'treasury_update';
  description: string;
  created_at: string;
  actor_id?: string;
}

export interface GuildTreasury {
  id: number;
  guild_id: number;
  balance: number;
  total_contributed: number;
  last_distribution: string;
  created_at: string;
}

export interface GuildWar {
  id: number;
  guild_id_1: number;
  guild_id_2: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'ended';
  guild_1_score: number;
  guild_2_score: number;
  prize_pool: number;
}

export interface GuildQuest {
  id: number;
  guild_id: number;
  name: string;
  description: string;
  type: 'mining' | 'pvp' | 'collection' | 'exploration';
  target: number;
  current_progress: number;
  reward: number;
  status: 'active' | 'completed' | 'failed';
  expires_at: string;
}

export interface GuildBonus {
  id: number;
  guild_id: number;
  type: 'mining_boost' | 'energy_boost' | 'reward_multiplier' | 'xp_multiplier';
  value: number;
  duration: number; // in minutes
  active_until: string;
}
