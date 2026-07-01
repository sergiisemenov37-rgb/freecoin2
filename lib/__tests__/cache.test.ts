import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cacheManager } from '../cache';

describe('CacheManager', () => {
  beforeEach(() => {
    cacheManager.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should store and retrieve data', () => {
    const testData = { value: 42 };
    cacheManager.set('test-key', testData);
    const retrieved = cacheManager.get('test-key');
    expect(retrieved).toEqual(testData);
  });

  it('should return null for non-existent keys', () => {
    const result = cacheManager.get('non-existent');
    expect(result).toBeNull();
  });

  it('should expire entries after TTL', () => {
    const testData = { value: 42 };
    cacheManager.set('test-key', testData, 100); // 100ms TTL
    
    // Should be available immediately
    expect(cacheManager.get('test-key')).toEqual(testData);
    
    // Wait for expiration
    vi.advanceTimersByTime(150);
    expect(cacheManager.get('test-key')).toBeNull();
  });

  it('should delete entries', () => {
    cacheManager.set('test-key', { value: 42 });
    cacheManager.delete('test-key');
    expect(cacheManager.get('test-key')).toBeNull();
  });

  it('should clear all entries', () => {
    cacheManager.set('key1', { value: 1 });
    cacheManager.set('key2', { value: 2 });
    cacheManager.clear();
    expect(cacheManager.size()).toBe(0);
  });

  it('should check if key exists', () => {
    cacheManager.set('test-key', { value: 42 });
    expect(cacheManager.has('test-key')).toBe(true);
    expect(cacheManager.has('non-existent')).toBe(false);
  });
});
