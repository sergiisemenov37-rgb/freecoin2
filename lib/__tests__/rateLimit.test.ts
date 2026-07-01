import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit, applyRateLimit, clearRateLimit } from '../rateLimit';

describe('Rate Limiting', () => {
  beforeEach(() => {
    clearRateLimit();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should allow requests within limit', () => {
    const result = checkRateLimit('test-key', 5, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('should block requests exceeding limit', () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit('test-key', 5, 60000);
    }
    
    const result = checkRateLimit('test-key', 5, 60000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should reset after window expires', () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit('test-key', 5, 60000);
    }
    
    // Advance time past window
    vi.advanceTimersByTime(70000);
    
    const result = checkRateLimit('test-key', 5, 60000);
    expect(result.allowed).toBe(true);
  });

  it('should handle different keys independently', () => {
    checkRateLimit('key1', 2, 60000);
    checkRateLimit('key1', 2, 60000);
    
    const result1 = checkRateLimit('key1', 2, 60000);
    expect(result1.allowed).toBe(false);
    
    const result2 = checkRateLimit('key2', 2, 60000);
    expect(result2.allowed).toBe(true);
  });
});
