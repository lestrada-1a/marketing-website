/**
 * Weather Data Cache
 *
 * Implements in-memory + localStorage caching of weather data to:
 * - Minimize API calls (bounded to at most once per 20 minutes per location)
 * - Ensure task view performance is not degraded by redundant fetches
 * - Persist weather data across page navigations within the TTL
 *
 * Privacy: Only weather condition data is cached, not raw location coordinates.
 * Cache entries auto-expire and are cleaned up proactively.
 */

import { WeatherCacheEntry, WeatherData } from './types';

const STORAGE_KEY_PREFIX = 'weather-theme-cache:';
const DEFAULT_TTL_MS = 20 * 60 * 1000; // 20 minutes
const MAX_CACHE_ENTRIES = 10;
const MIN_FETCH_INTERVAL_MS = 20 * 60 * 1000; // Minimum 20 minutes between fetches

export interface WeatherCacheOptions {
  /** Time-to-live for cache entries in milliseconds (default: 20 min) */
  ttlMs?: number;
  /** Maximum number of cache entries to retain (default: 10) */
  maxEntries?: number;
  /** Minimum interval between API fetches per location in ms (default: 20 min) */
  minFetchIntervalMs?: number;
  /** Use localStorage for persistence (default: true) */
  useLocalStorage?: boolean;
}

export class WeatherCache {
  private memoryCache: Map<string, WeatherCacheEntry> = new Map();
  private lastFetchTimes: Map<string, number> = new Map();
  private readonly ttlMs: number;
  private readonly maxEntries: number;
  private readonly minFetchIntervalMs: number;
  private readonly useLocalStorage: boolean;

  constructor(options: WeatherCacheOptions = {}) {
    this.ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
    this.maxEntries = options.maxEntries ?? MAX_CACHE_ENTRIES;
    this.minFetchIntervalMs = options.minFetchIntervalMs ?? MIN_FETCH_INTERVAL_MS;
    this.useLocalStorage = options.useLocalStorage ?? true;
    this.loadFromStorage();
  }

  /**
   * Get cached weather data for a location key.
   * Returns null if no valid (non-expired) entry exists.
   */
  get(cacheKey: string): WeatherData | null {
    // Try memory cache first
    const entry = this.memoryCache.get(cacheKey);
    if (entry && !this.isExpired(entry)) {
      return entry.data;
    }

    // Try localStorage fallback
    if (this.useLocalStorage) {
      const stored = this.readFromStorage(cacheKey);
      if (stored && !this.isExpired(stored)) {
        this.memoryCache.set(cacheKey, stored);
        return stored.data;
      }
    }

    // Clean up expired entry
    if (entry) {
      this.memoryCache.delete(cacheKey);
      this.removeFromStorage(cacheKey);
    }

    return null;
  }

  /**
   * Store weather data in the cache.
   */
  set(cacheKey: string, data: WeatherData): void {
    const now = Date.now();
    const entry: WeatherCacheEntry = {
      key: cacheKey,
      data,
      createdAt: now,
      expiresAt: now + this.ttlMs,
    };

    this.memoryCache.set(cacheKey, entry);
    this.lastFetchTimes.set(cacheKey, now);

    if (this.useLocalStorage) {
      this.writeToStorage(cacheKey, entry);
    }

    this.enforceMaxEntries();
  }

  /**
   * Check if a fetch is allowed for the given cache key based on rate limiting.
   * Prevents excessive API calls by enforcing minimum intervals between fetches.
   */
  canFetch(cacheKey: string): boolean {
    const lastFetch = this.lastFetchTimes.get(cacheKey);
    if (!lastFetch) return true;
    return Date.now() - lastFetch >= this.minFetchIntervalMs;
  }

  /**
   * Record that a fetch attempt was made (even if it failed).
   * This prevents retry storms on repeated failures.
   */
  recordFetchAttempt(cacheKey: string): void {
    this.lastFetchTimes.set(cacheKey, Date.now());
  }

  /**
   * Invalidate a specific cache entry.
   */
  invalidate(cacheKey: string): void {
    this.memoryCache.delete(cacheKey);
    this.lastFetchTimes.delete(cacheKey);
    this.removeFromStorage(cacheKey);
  }

  /**
   * Clear all cache entries.
   */
  clear(): void {
    this.memoryCache.clear();
    this.lastFetchTimes.clear();
    this.clearStorage();
  }

  /**
   * Get the number of cached entries.
   */
  get size(): number {
    return this.memoryCache.size;
  }

  // --- Private Helpers ---

  private isExpired(entry: WeatherCacheEntry): boolean {
    return Date.now() >= entry.expiresAt;
  }

  private enforceMaxEntries(): void {
    if (this.memoryCache.size <= this.maxEntries) return;

    // Remove oldest entries first
    const entries = Array.from(this.memoryCache.entries()).sort(
      ([, a], [, b]) => a.createdAt - b.createdAt
    );

    while (entries.length > this.maxEntries) {
      const [key] = entries.shift()!;
      this.memoryCache.delete(key);
      this.removeFromStorage(key);
    }
  }

  // --- LocalStorage Helpers ---

  private getStorageKey(cacheKey: string): string {
    return `${STORAGE_KEY_PREFIX}${cacheKey}`;
  }

  private readFromStorage(cacheKey: string): WeatherCacheEntry | null {
    if (typeof localStorage === 'undefined') return null;

    try {
      const raw = localStorage.getItem(this.getStorageKey(cacheKey));
      if (!raw) return null;
      return JSON.parse(raw) as WeatherCacheEntry;
    } catch {
      return null;
    }
  }

  private writeToStorage(cacheKey: string, entry: WeatherCacheEntry): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(this.getStorageKey(cacheKey), JSON.stringify(entry));
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }

  private removeFromStorage(cacheKey: string): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.removeItem(this.getStorageKey(cacheKey));
    } catch {
      // Silently ignore
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined' || !this.useLocalStorage) return;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
          const cacheKey = key.slice(STORAGE_KEY_PREFIX.length);
          const entry = this.readFromStorage(cacheKey);
          if (entry && !this.isExpired(entry)) {
            this.memoryCache.set(cacheKey, entry);
          } else if (entry) {
            this.removeFromStorage(cacheKey);
          }
        }
      }
    } catch {
      // Silently ignore storage errors
    }
  }

  private clearStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch {
      // Silently ignore
    }
  }
}
