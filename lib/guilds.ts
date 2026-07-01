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
  experience: number;
  reputation: number;
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
export const GUILD_LEVEL_UP_COST = 5000; // FREE per level

export interface GuildQuest {
  id: string;
  guild_id: string;
  name: string;
  description: string;
  type: 'mining' | 'referrals' | 'tasks' | 'games';
  requirement: number;
  reward: number;
  progress: number;
  completed: boolean;
  created_at: string;
}

export interface GuildDonation {
  id: string;
  guild_id: string;
  telegram_id: string;
  username: string;
  amount: number;
  created_at: string;
}

export function generateGuildQuests(guildId: string): GuildQuest[] {
  return [
    {
      id: `quest-${guildId}-1`,
      guild_id: guildId,
      name: 'Guild Mining Goal',
      description: 'Members mine 10,000 FREE together',
      type: 'mining',
      requirement: 10000,
      reward: 5000,
      progress: 0,
      completed: false,
      created_at: new Date().toISOString()
    },
    {
      id: `quest-${guildId}-2`,
      guild_id: guildId,
      name: 'Recruit New Members',
      description: 'Guild reaches 20 members',
      type: 'referrals',
      requirement: 20,
      reward: 3000,
      progress: 0,
      completed: false,
      created_at: new Date().toISOString()
    },
    {
      id: `quest-${guildId}-3`,
      guild_id: guildId,
      name: 'Task Masters',
      description: 'Members complete 100 tasks',
      type: 'tasks',
      requirement: 100,
      reward: 2000,
      progress: 0,
      completed: false,
      created_at: new Date().toISOString()
    },
    {
      id: `quest-${guildId}-4`,
      guild_id: guildId,
      name: 'Gaming Champions',
      description: 'Members play 500 games',
      type: 'games',
      requirement: 500,
      reward: 2500,
      progress: 0,
      completed: false,
      created_at: new Date().toISOString()
    }
  ];
}

export function getGuildLevelUpCost(currentLevel: number): number {
  return GUILD_LEVEL_UP_COST * currentLevel;
}

export function getGuildExperienceForLevel(level: number): number {
  return level * 10000;
}

export function canLevelUpGuild(currentLevel: number, currentExp: number, currentBalance: number): boolean {
  const requiredExp = getGuildExperienceForLevel(currentLevel + 1);
  const cost = getGuildLevelUpCost(currentLevel);
  return currentExp >= requiredExp && currentBalance >= cost;
}
