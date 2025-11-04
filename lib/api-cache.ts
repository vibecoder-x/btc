/**
 * Simple client-side API caching utility
 * Reduces unnecessary API calls and improves performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class APICache {
  private cache: Map<string, CacheEntry<any>>;
  private readonly defaultTTL = 60000; // 60 seconds default

  constructor() {
    this.cache = new Map();
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if cache entry has expired
    if (age > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Store data in cache with TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      if (age > entry.expiresIn) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
export const apiCache = new APICache();

// Cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => apiCache.cleanup(), 5 * 60 * 1000);
}

/**
 * Fetch with caching
 * Automatically caches GET requests
 */
export async function fetchWithCache<T>(
  url: string,
  options?: RequestInit,
  ttl?: number
): Promise<T> {
  // Only cache GET requests
  const method = options?.method || 'GET';
  const cacheKey = `${method}:${url}`;

  if (method === 'GET') {
    const cached = apiCache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Cache the response if it's a GET request
  if (method === 'GET') {
    apiCache.set(cacheKey, data, ttl);
  }

  return data;
}
