export interface Guild {
  id: string;
  name: string;
  description: string;
  emblem: string;
  leader_id: string;
  leader_name: string;
  members_count: number;
  total_power: number;
  total_balance: number;
  level: number;
  created_at: string;
}

export interface GuildMember {
  telegram_id: string;
  username: string;
  first_name: string;
  guild_id: string;
  role: 'leader' | 'officer' | 'member';
  joined_at: string;
  contribution: number;
}

export interface GuildBonus {
  level: number;
  name: string;
  miningBonus: number;
  referralBonus: number;
  maxMembers: number;
}

export const guildBonuses: GuildBonus[] = [
  { level: 1, name: 'Rookie', miningBonus: 0.05, referralBonus: 0.02, maxMembers: 10 },
  { level: 2, name: 'Bronze', miningBonus: 0.10, referralBonus: 0.05, maxMembers: 20 },
  { level: 3, name: 'Silver', miningBonus: 0.15, referralBonus: 0.08, maxMembers: 30 },
  { level: 4, name: 'Gold', miningBonus: 0.20, referralBonus: 0.10, maxMembers: 50 },
  { level: 5, name: 'Platinum', miningBonus: 0.25, referralBonus: 0.15, maxMembers: 75 },
  { level: 6, name: 'Diamond', miningBonus: 0.30, referralBonus: 0.20, maxMembers: 100 },
  { level: 7, name: 'Legendary', miningBonus: 0.40, referralBonus: 0.25, maxMembers: 150 },
  { level: 8, name: 'Mythic', miningBonus: 0.50, referralBonus: 0.30, maxMembers: 200 },
];

export function getGuildBonus(guildLevel: number): GuildBonus {
  return guildBonuses[Math.min(guildLevel - 1, guildBonuses.length - 1)];
}

export function calculateGuildPower(members: GuildMember[]): number {
  return members.reduce((total, member) => total + member.contribution, 0);
}

export function canJoinGuild(guild: Guild, currentMembers: number): boolean {
  const bonus = getGuildBonus(guild.level);
  return currentMembers < bonus.maxMembers;
}

export interface GuildCreateOptions {
  name: string;
  description: string;
  emblem: string;
  leaderId: string;
  leaderName: string;
}

export const GUILD_CREATE_COST = 1000; // FREE
export const GUILD_JOIN_COST = 100; // FREE
