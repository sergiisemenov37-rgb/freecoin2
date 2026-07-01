import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

interface CacheConfig {
  ttl?: number; // seconds
  tags?: string[];
}

class CacheManager {
  private cache: NodeCache;
  private tags: Map<string, Set<string>>;

  constructor() {
    this.cache = cache;
    this.tags = new Map();
  }

  set<T>(key: string, value: T, config?: CacheConfig): void {
    this.cache.set(key, value, config?.ttl);
    if (config?.tags) {
      config.tags.forEach(tag => {
        if (!this.tags.has(tag)) {
          this.tags.set(tag, new Set());
        }
        this.tags.get(tag)!.add(key);
      });
    }
  }

  get<T>(key: string): T | undefined {
    return this.cache.get(key) as T;
  }

  delete(key: string): void {
    this.cache.del(key);
  }

  deleteByTag(tag: string): void {
    const keys = this.tags.get(tag);
    if (keys) {
      keys.forEach(key => this.cache.del(key));
      this.tags.delete(tag);
    }
  }

  clear(): void {
    this.cache.flushAll();
    this.tags.clear();
  }

  getStats() {
    return this.cache.getStats();
  }
}

export const cacheManager = new CacheManager();

export const getCachedOrFetch = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  config?: CacheConfig
): Promise<T> => {
  const cached = cacheManager.get<T>(key);
  if (cached) {
    return cached;
  }

  const data = await fetcher();
  cacheManager.set(key, data, config);
  return data;
};
