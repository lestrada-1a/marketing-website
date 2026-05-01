import { WeatherCache } from '../weather-cache';
import { WeatherCondition, WeatherData } from '../types';

function createMockWeatherData(overrides: Partial<WeatherData> = {}): WeatherData {
  const now = Date.now();
  return {
    condition: WeatherCondition.Clear,
    temperature: 25,
    description: 'Clear sky',
    icon: '01d',
    fetchedAt: now,
    expiresAt: now + 20 * 60 * 1000,
    ...overrides,
  };
}

describe('WeatherCache', () => {
  let cache: WeatherCache;

  beforeEach(() => {
    localStorage.clear();
    cache = new WeatherCache({ useLocalStorage: false });
  });

  describe('get/set', () => {
    it('should store and retrieve weather data', () => {
      const data = createMockWeatherData();
      cache.set('test-key', data);

      const result = cache.get('test-key');
      expect(result).toEqual(data);
    });

    it('should return null for missing keys', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('should return null for expired entries', () => {
      const data = createMockWeatherData({
        expiresAt: Date.now() - 1000, // Already expired
      });

      // Manually set with very short TTL
      const shortCache = new WeatherCache({ ttlMs: 1, useLocalStorage: false });
      // Need to wait for expiry or mock time
      shortCache.set('expired-key', data);

      // The cache sets its own expiresAt, so let's test differently
      // by creating a cache with 0 TTL
      const instantCache = new WeatherCache({ ttlMs: 0, useLocalStorage: false });
      instantCache.set('instant-key', data);

      // With 0 TTL, the entry should be immediately expired
      // (expiresAt = now + 0 = now, which is <= Date.now())
      expect(instantCache.get('instant-key')).toBeNull();
    });
  });

  describe('canFetch', () => {
    it('should allow first fetch for a new key', () => {
      expect(cache.canFetch('new-key')).toBe(true);
    });

    it('should prevent fetching within the minimum interval', () => {
      cache.recordFetchAttempt('rate-key');
      expect(cache.canFetch('rate-key')).toBe(false);
    });

    it('should allow fetching after the minimum interval', () => {
      const shortCache = new WeatherCache({
        minFetchIntervalMs: 0,
        useLocalStorage: false,
      });
      shortCache.recordFetchAttempt('rate-key');
      expect(shortCache.canFetch('rate-key')).toBe(true);
    });
  });

  describe('invalidate', () => {
    it('should remove a specific cache entry', () => {
      cache.set('key1', createMockWeatherData());
      cache.set('key2', createMockWeatherData());

      cache.invalidate('key1');
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).not.toBeNull();
    });
  });

  describe('clear', () => {
    it('should remove all cache entries', () => {
      cache.set('key1', createMockWeatherData());
      cache.set('key2', createMockWeatherData());

      cache.clear();
      expect(cache.size).toBe(0);
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });
  });

  describe('max entries', () => {
    it('should evict oldest entries when max is exceeded', () => {
      const smallCache = new WeatherCache({
        maxEntries: 2,
        useLocalStorage: false,
      });

      smallCache.set('key1', createMockWeatherData());
      smallCache.set('key2', createMockWeatherData());
      smallCache.set('key3', createMockWeatherData());

      expect(smallCache.size).toBe(2);
      // key1 should have been evicted (oldest)
      expect(smallCache.get('key1')).toBeNull();
      expect(smallCache.get('key3')).not.toBeNull();
    });
  });

  describe('localStorage persistence', () => {
    it('should persist to localStorage when enabled', () => {
      const persistentCache = new WeatherCache({ useLocalStorage: true });
      const data = createMockWeatherData();

      persistentCache.set('persist-key', data);

      const stored = localStorage.getItem('weather-theme-cache:persist-key');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.data.condition).toBe(data.condition);
    });

    it('should load from localStorage on initialization', () => {
      // Pre-populate localStorage
      const data = createMockWeatherData();
      const entry = {
        key: 'restore-key',
        data,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60000,
      };
      localStorage.setItem(
        'weather-theme-cache:restore-key',
        JSON.stringify(entry)
      );

      // Create new cache instance
      const newCache = new WeatherCache({ useLocalStorage: true });
      const result = newCache.get('restore-key');
      expect(result).not.toBeNull();
      expect(result!.condition).toBe(WeatherCondition.Clear);
    });
  });
});
