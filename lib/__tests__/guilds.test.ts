import { describe, it, expect } from 'vitest';
import { 
  getGuildBonus, 
  calculateGuildPower, 
  canJoinGuild,
  getGuildLevelUpCost,
  getGuildExperienceForLevel,
  canLevelUpGuild
} from '../guilds';

describe('Guild Functions', () => {
  it('should return correct bonus for level', () => {
    const bonus = getGuildBonus(1);
    expect(bonus.name).toBe('Rookie');
    expect(bonus.miningBonus).toBe(0.05);
    expect(bonus.maxMembers).toBe(10);
  });

  it('should calculate guild power from members', () => {
    const members = [
      { contribution: 100 },
      { contribution: 200 },
      { contribution: 300 }
    ];
    const power = calculateGuildPower(members as any);
    expect(power).toBe(600);
  });

  it('should check if user can join guild', () => {
    const guild = { level: 1 } as any;
    expect(canJoinGuild(guild, 5)).toBe(true);
    expect(canJoinGuild(guild, 10)).toBe(true);
    expect(canJoinGuild(guild, 11)).toBe(false);
  });

  it('should calculate level up cost', () => {
    expect(getGuildLevelUpCost(1)).toBe(5000);
    expect(getGuildLevelUpCost(5)).toBe(25000);
  });

  it('should calculate experience needed for level', () => {
    expect(getGuildExperienceForLevel(2)).toBe(20000);
    expect(getGuildExperienceForLevel(5)).toBe(50000);
  });

  it('should check if guild can level up', () => {
    expect(canLevelUpGuild(1, 20000, 5000)).toBe(true);
    expect(canLevelUpGuild(1, 10000, 5000)).toBe(false);
    expect(canLevelUpGuild(1, 20000, 1000)).toBe(false);
  });
});
