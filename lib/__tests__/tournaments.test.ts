import { describe, it, expect } from 'vitest';
import { 
  calculateTournamentScore,
  getTimeUntilTournamentEnd,
  canJoinTournament
} from '../tournaments';

describe('Tournament Functions', () => {
  it('should calculate mining tournament score', () => {
    const score = calculateTournamentScore('mining', 1000, 5, 10, 50);
    expect(score).toBe(1000);
  });

  it('should calculate referrals tournament score', () => {
    const score = calculateTournamentScore('referrals', 0, 0, 5, 0);
    expect(score).toBe(5000);
  });

  it('should calculate tasks tournament score', () => {
    const score = calculateTournamentScore('tasks', 0, 0, 0, 50);
    expect(score).toBe(5000);
  });

  it('should calculate level tournament score', () => {
    const score = calculateTournamentScore('level', 0, 10, 0, 0);
    expect(score).toBe(5000);
  });

  it('should calculate casino tournament score', () => {
    const score = calculateTournamentScore('casino', 0, 0, 0, 0, 10);
    expect(score).toBe(500);
  });

  it('should calculate games tournament score', () => {
    const score = calculateTournamentScore('games', 0, 0, 0, 0, 0, 100);
    expect(score).toBe(1000);
  });

  it('should check if user can join tournament', () => {
    const tournament = {
      status: 'upcoming',
      currentParticipants: 50,
      maxParticipants: 100,
      entryFee: 100
    } as any;
    
    expect(canJoinTournament(tournament, 200)).toBe(true);
    expect(canJoinTournament(tournament, 50)).toBe(false);
    expect(canJoinTournament(tournament, 200)).toBe(true);
  });

  it('should not allow joining completed tournament', () => {
    const tournament = {
      status: 'completed',
      currentParticipants: 50,
      maxParticipants: 100,
      entryFee: 100
    } as any;
    
    expect(canJoinTournament(tournament, 200)).toBe(false);
  });
});
