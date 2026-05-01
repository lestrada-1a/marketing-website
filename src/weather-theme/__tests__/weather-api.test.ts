import { WeatherCondition } from '../types';
import { mapOwmConditionCode, createFallbackWeatherData } from '../weather-api';

describe('Weather API', () => {
  describe('mapOwmConditionCode', () => {
    it('should map thunderstorm codes (2xx) to Stormy', () => {
      expect(mapOwmConditionCode(200, 20)).toBe(WeatherCondition.Stormy);
      expect(mapOwmConditionCode(232, 20)).toBe(WeatherCondition.Stormy);
    });

    it('should map drizzle codes (3xx) to Rainy', () => {
      expect(mapOwmConditionCode(300, 15)).toBe(WeatherCondition.Rainy);
      expect(mapOwmConditionCode(321, 15)).toBe(WeatherCondition.Rainy);
    });

    it('should map rain codes (5xx) to Rainy', () => {
      expect(mapOwmConditionCode(500, 18)).toBe(WeatherCondition.Rainy);
      expect(mapOwmConditionCode(531, 18)).toBe(WeatherCondition.Rainy);
    });

    it('should map snow codes (6xx) to Snowy', () => {
      expect(mapOwmConditionCode(600, -5)).toBe(WeatherCondition.Snowy);
      expect(mapOwmConditionCode(622, -5)).toBe(WeatherCondition.Snowy);
    });

    it('should map atmosphere codes (7xx) to Cloudy', () => {
      expect(mapOwmConditionCode(701, 20)).toBe(WeatherCondition.Cloudy);
      expect(mapOwmConditionCode(781, 20)).toBe(WeatherCondition.Cloudy);
    });

    it('should map clear sky (800) to Clear', () => {
      expect(mapOwmConditionCode(800, 25)).toBe(WeatherCondition.Clear);
    });

    it('should map cloud codes (80x) to Cloudy', () => {
      expect(mapOwmConditionCode(801, 22)).toBe(WeatherCondition.Cloudy);
      expect(mapOwmConditionCode(804, 22)).toBe(WeatherCondition.Cloudy);
    });

    it('should override with ExtremeHeat when temp >= 40°C', () => {
      expect(mapOwmConditionCode(800, 42)).toBe(WeatherCondition.ExtremeHeat);
      expect(mapOwmConditionCode(500, 45)).toBe(WeatherCondition.ExtremeHeat);
    });

    it('should override with ExtremeCold when temp <= -15°C', () => {
      expect(mapOwmConditionCode(800, -20)).toBe(WeatherCondition.ExtremeCold);
      expect(mapOwmConditionCode(600, -15)).toBe(WeatherCondition.ExtremeCold);
    });

    it('should return Unknown for unrecognized codes', () => {
      expect(mapOwmConditionCode(999, 20)).toBe(WeatherCondition.Unknown);
      expect(mapOwmConditionCode(100, 20)).toBe(WeatherCondition.Unknown);
    });
  });

  describe('createFallbackWeatherData', () => {
    it('should create fallback data with Unknown condition by default', () => {
      const data = createFallbackWeatherData();
      expect(data.condition).toBe(WeatherCondition.Unknown);
      expect(data.description).toBe('Weather data unavailable');
      expect(data.fetchedAt).toBeLessThanOrEqual(Date.now());
      expect(data.expiresAt).toBeGreaterThan(Date.now());
    });

    it('should accept a custom condition', () => {
      const data = createFallbackWeatherData(WeatherCondition.Clear);
      expect(data.condition).toBe(WeatherCondition.Clear);
    });
  });
});
