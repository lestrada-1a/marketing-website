import { WeatherCondition } from '../types';
import { getThemeForCondition, getAllThemes, WEATHER_THEMES } from '../themes';

describe('Weather Themes', () => {
  describe('WEATHER_THEMES', () => {
    it('should define a theme for every WeatherCondition', () => {
      const conditions = Object.values(WeatherCondition);
      conditions.forEach((condition) => {
        expect(WEATHER_THEMES[condition]).toBeDefined();
        expect(WEATHER_THEMES[condition].condition).toBe(condition);
      });
    });

    it('should have unique theme IDs', () => {
      const ids = Object.values(WEATHER_THEMES).map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should include non-color cues (icon and label) for every theme', () => {
      Object.values(WEATHER_THEMES).forEach((theme) => {
        expect(theme.icon).toBeTruthy();
        expect(theme.label).toBeTruthy();
        expect(theme.ariaLabel).toBeTruthy();
      });
    });

    it('should include CSS variables for every theme', () => {
      const expectedVars = [
        '--wt-task-bg',
        '--wt-task-bg-alt',
        '--wt-text-primary',
        '--wt-text-secondary',
        '--wt-border',
        '--wt-accent',
        '--wt-badge-bg',
        '--wt-badge-text',
      ];

      Object.values(WEATHER_THEMES).forEach((theme) => {
        expectedVars.forEach((varName) => {
          expect(theme.cssVariables[varName]).toBeDefined();
          expect(theme.cssVariables[varName]).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });
      });
    });
  });

  describe('getThemeForCondition', () => {
    it('should return the correct theme for each known condition', () => {
      expect(getThemeForCondition(WeatherCondition.Clear).id).toBe('theme-clear');
      expect(getThemeForCondition(WeatherCondition.Rainy).id).toBe('theme-rainy');
      expect(getThemeForCondition(WeatherCondition.Stormy).id).toBe('theme-stormy');
      expect(getThemeForCondition(WeatherCondition.Snowy).id).toBe('theme-snowy');
      expect(getThemeForCondition(WeatherCondition.ExtremeHeat).id).toBe('theme-extreme-heat');
      expect(getThemeForCondition(WeatherCondition.ExtremeCold).id).toBe('theme-extreme-cold');
    });

    it('should fall back to Unknown theme for unrecognized conditions', () => {
      const theme = getThemeForCondition(WeatherCondition.Unknown);
      expect(theme.id).toBe('theme-unknown');
    });
  });

  describe('getAllThemes', () => {
    it('should return all themes', () => {
      const themes = getAllThemes();
      expect(themes.length).toBe(Object.values(WeatherCondition).length);
    });
  });
});
