import { cacheManager, generateCacheKey, cachedFetch } from './cache';
import { syncMining, getGames } from './api';

export async function getCachedMining() {
  return cachedFetch(
    'mining',
    syncMining,
    30 * 1000 // 30 seconds
  );
}

export async function getCachedGames() {
  return cachedFetch(
    'games',
    getGames,
    5 * 60 * 1000 // 5 minutes
  );
}

export function invalidateMiningCache() {
  cacheManager.delete('mining');
}

export function invalidateGamesCache() {
  cacheManager.delete('games');
}

export function invalidateAllCache() {
  cacheManager.clear();
}
