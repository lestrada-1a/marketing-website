/**
 * Tests for weather theme mapping logic
 */

import {
  getThemeForCondition,
  getAllThemes,
  mapWeatherCodeToCondition,
  getWeatherDescription,
  WEATHER_THEME_MAP,
} from '@/lib/weather-themes';
import { WeatherCondition } from '@/types/weather';

describe('Weather Theme Mapping', () => {
  describe('WEATHER_THEME_MAP', () => {
    const allConditions: WeatherCondition[] = [
      'clear', 'cloudy', 'rainy', 'stormy', 'snowy',
      'extreme_heat', 'extreme_cold', 'unknown',
    ];

    it('has a theme defined for every weather condition', () => {
      allConditions.forEach((condition) => {
        expect(WEATHER_THEME_MAP[condition]).toBeDefined();
        expect(WEATHER_THEME_MAP[condition].condition).toBe(condition);
      });
    });

    it('every theme has all required color properties', () => {
      const requiredColorKeys = [
        'cardBackground', 'cardBackgroundAlt', 'textPrimary', 'textSecondary',
        'accent', 'badgeBackground', 'badgeText', 'viewBackground',
      ];

      Object.values(WEATHER_THEME_MAP).forEach((theme) => {
        requiredColorKeys.forEach((key) => {
          expect(theme.colors).toHaveProperty(key);
          expect(theme.colors[key as keyof typeof theme.colors]).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });
      });
    });

    it('every theme has an icon (non-color cue) and label', () => {
      Object.values(WEATHER_THEME_MAP).forEach((theme) => {
        expect(theme.icon).toBeTruthy();
        expect(theme.label).toBeTruthy();
        expect(theme.ariaLabel).toBeTruthy();
      });
    });

    it('every theme has an accessible aria label', () => {
      Object.values(WEATHER_THEME_MAP).forEach((theme) => {
        expect(theme.ariaLabel.length).toBeGreaterThan(10);
        expect(theme.ariaLabel.toLowerCase()).toContain('weather theme');
      });
    });
  });

  describe('getThemeForCondition', () => {
    it('returns the correct theme for each known condition', () => {
      expect(getThemeForCondition('clear').label).toBe('Clear Skies');
      expect(getThemeForCondition('rainy').label).toBe('Rainy');
      expect(getThemeForCondition('stormy').label).toBe('Stormy');
      expect(getThemeForCondition('snowy').label).toBe('Snowy');
      expect(getThemeForCondition('cloudy').label).toBe('Cloudy');
      expect(getThemeForCondition('extreme_heat').label).toBe('Extreme Heat');
      expect(getThemeForCondition('extreme_cold').label).toBe('Extreme Cold');
    });

    it('returns the unknown theme for unrecognized conditions', () => {
      expect(getThemeForCondition('unknown').label).toBe('Weather Unavailable');
    });
  });

  describe('getAllThemes', () => {
    it('returns all 8 themes', () => {
      const themes = getAllThemes();
      expect(themes).toHaveLength(8);
    });

    it('includes themes for all conditions', () => {
      const themes = getAllThemes();
      const conditions = themes.map((t) => t.condition);
      expect(conditions).toContain('clear');
      expect(conditions).toContain('cloudy');
      expect(conditions).toContain('rainy');
      expect(conditions).toContain('stormy');
      expect(conditions).toContain('snowy');
      expect(conditions).toContain('extreme_heat');
      expect(conditions).toContain('extreme_cold');
      expect(conditions).toContain('unknown');
    });
  });

  describe('mapWeatherCodeToCondition', () => {
    it('maps clear sky codes to clear', () => {
      expect(mapWeatherCodeToCondition(0, 20)).toBe('clear');
      expect(mapWeatherCodeToCondition(1, 20)).toBe('clear');
    });

    it('maps cloudy codes to cloudy', () => {
      expect(mapWeatherCodeToCondition(2, 20)).toBe('cloudy');
      expect(mapWeatherCodeToCondition(3, 20)).toBe('cloudy');
    });

    it('maps fog codes to cloudy', () => {
      expect(mapWeatherCodeToCondition(45, 20)).toBe('cloudy');
      expect(mapWeatherCodeToCondition(48, 20)).toBe('cloudy');
    });

    it('maps rain codes to rainy', () => {
      expect(mapWeatherCodeToCondition(51, 15)).toBe('rainy');
      expect(mapWeatherCodeToCondition(61, 15)).toBe('rainy');
      expect(mapWeatherCodeToCondition(65, 15)).toBe('rainy');
      expect(mapWeatherCodeToCondition(80, 15)).toBe('rainy');
    });

    it('maps snow codes to snowy', () => {
      expect(mapWeatherCodeToCondition(71, 0)).toBe('snowy');
      expect(mapWeatherCodeToCondition(75, 0)).toBe('snowy');
      expect(mapWeatherCodeToCondition(85, 0)).toBe('snowy');
    });

    it('maps thunderstorm codes to stormy', () => {
      expect(mapWeatherCodeToCondition(95, 20)).toBe('stormy');
      expect(mapWeatherCodeToCondition(96, 20)).toBe('stormy');
      expect(mapWeatherCodeToCondition(99, 20)).toBe('stormy');
    });

    it('detects extreme heat regardless of weather code', () => {
      expect(mapWeatherCodeToCondition(0, 40)).toBe('extreme_heat');
      expect(mapWeatherCodeToCondition(0, 45)).toBe('extreme_heat');
      expect(mapWeatherCodeToCondition(3, 42)).toBe('extreme_heat');
    });

    it('detects extreme cold regardless of weather code', () => {
      expect(mapWeatherCodeToCondition(0, -15)).toBe('extreme_cold');
      expect(mapWeatherCodeToCondition(0, -25)).toBe('extreme_cold');
      expect(mapWeatherCodeToCondition(71, -20)).toBe('extreme_cold');
    });

    it('returns unknown for unrecognized codes', () => {
      expect(mapWeatherCodeToCondition(999, 20)).toBe('unknown');
      expect(mapWeatherCodeToCondition(-1, 20)).toBe('unknown');
    });
  });

  describe('getWeatherDescription', () => {
    it('returns correct descriptions for known codes', () => {
      expect(getWeatherDescription(0)).toBe('Clear sky');
      expect(getWeatherDescription(3)).toBe('Overcast');
      expect(getWeatherDescription(61)).toBe('Slight rain');
      expect(getWeatherDescription(95)).toBe('Thunderstorm');
    });

    it('returns "Unknown conditions" for unrecognized codes', () => {
      expect(getWeatherDescription(999)).toBe('Unknown conditions');
    });
  });
});
