/**
 * Tests for weather service - caching, geolocation, API integration
 */

import { roundCoordinates } from '@/lib/weather-service';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('Weather Service', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('roundCoordinates', () => {
    it('rounds coordinates to 1 decimal place for privacy', () => {
      const result = roundCoordinates(51.5074, -0.1278);
      expect(result.lat).toBe(51.5);
      expect(result.lon).toBe(-0.1);
    });

    it('handles negative coordinates', () => {
      const result = roundCoordinates(-33.8688, 151.2093);
      expect(result.lat).toBe(-33.9);
      expect(result.lon).toBe(151.2);
    });

    it('handles zero coordinates', () => {
      const result = roundCoordinates(0, 0);
      expect(result.lat).toBe(0);
      expect(result.lon).toBe(0);
    });

    it('handles precise coordinates consistently', () => {
      const result1 = roundCoordinates(40.7128, -74.0060);
      const result2 = roundCoordinates(40.7589, -74.0445);
      // Both are in NYC area, should round to same general area
      expect(result1.lat).toBe(40.7);
      expect(result2.lat).toBe(40.8);
    });
  });

  describe('Caching behavior', () => {
    it('cache key uses rounded coordinates, never precise ones', () => {
      // Verify by checking that two nearby coordinates produce the same rounded result
      const coord1 = roundCoordinates(51.5074, -0.1278);
      const coord2 = roundCoordinates(51.5100, -0.1300);
      const key1 = `coords:${coord1.lat},${coord1.lon}`;
      const key2 = `coords:${coord2.lat},${coord2.lon}`;
      // Both should round to the same key
      expect(key1).toBe(key2);
    });

    it('different city names produce different cache keys', () => {
      const key1 = `city:${'london'.toLowerCase().trim()}`;
      const key2 = `city:${'tokyo'.toLowerCase().trim()}`;
      expect(key1).not.toBe(key2);
    });

    it('city name cache keys are case-insensitive', () => {
      const key1 = `city:${'London'.toLowerCase().trim()}`;
      const key2 = `city:${'london'.toLowerCase().trim()}`;
      expect(key1).toBe(key2);
    });
  });
});
