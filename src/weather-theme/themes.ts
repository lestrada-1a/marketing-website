/**
 * Weather Condition → Theme Mapping
 *
 * All color palettes are designed to be:
 * - WCAG 2.1 AA compliant (minimum 4.5:1 contrast ratio for text)
 * - Color-blind safe (distinguishable under protanopia, deuteranopia, tritanopia)
 * - Each theme includes a non-color cue (icon + label) so weather state
 *   is never communicated by color alone.
 */

import { WeatherCondition, WeatherTheme, WeatherThemeColors } from './types';

// --- Accessible Color Palettes ---

const CLEAR_COLORS: WeatherThemeColors = {
  taskBackground: '#FFF8E7',
  taskBackgroundAlt: '#FFF3CD',
  textPrimary: '#3D3100',
  textSecondary: '#665200',
  border: '#E6D590',
  accent: '#D4A017',
  badgeBackground: '#F5E6A3',
  badgeText: '#3D3100',
};

const CLOUDY_COLORS: WeatherThemeColors = {
  taskBackground: '#F0F2F5',
  taskBackgroundAlt: '#E4E7EB',
  textPrimary: '#1A1F2B',
  textSecondary: '#4A5068',
  border: '#C8CDD5',
  accent: '#6B7899',
  badgeBackground: '#D8DCE3',
  badgeText: '#1A1F2B',
};

const RAINY_COLORS: WeatherThemeColors = {
  taskBackground: '#E8F0FE',
  taskBackgroundAlt: '#D2E3FC',
  textPrimary: '#0D2137',
  textSecondary: '#1A4472',
  border: '#A8C7F0',
  accent: '#1967D2',
  badgeBackground: '#C5DAF5',
  badgeText: '#0D2137',
};

const STORMY_COLORS: WeatherThemeColors = {
  taskBackground: '#E8E0F0',
  taskBackgroundAlt: '#D9CEE8',
  textPrimary: '#1F0F33',
  textSecondary: '#3D2266',
  border: '#B8A3D1',
  accent: '#7B4FBF',
  badgeBackground: '#CCBDE0',
  badgeText: '#1F0F33',
};

const SNOWY_COLORS: WeatherThemeColors = {
  taskBackground: '#F0F8FF',
  taskBackgroundAlt: '#E0F0FF',
  textPrimary: '#0A1929',
  textSecondary: '#1C3A5C',
  border: '#B0D4F1',
  accent: '#4A90D9',
  badgeBackground: '#D0E8FA',
  badgeText: '#0A1929',
};

const EXTREME_HEAT_COLORS: WeatherThemeColors = {
  taskBackground: '#FFF0E6',
  taskBackgroundAlt: '#FFE0CC',
  textPrimary: '#3D1500',
  textSecondary: '#6B2600',
  border: '#F0B088',
  accent: '#D45B0A',
  badgeBackground: '#F5C9A5',
  badgeText: '#3D1500',
};

const EXTREME_COLD_COLORS: WeatherThemeColors = {
  taskBackground: '#E6F3F8',
  taskBackgroundAlt: '#CCE8F2',
  textPrimary: '#05202D',
  textSecondary: '#0C3D54',
  border: '#8CC4DB',
  accent: '#1B7FA6',
  badgeBackground: '#B0D8E8',
  badgeText: '#05202D',
};

const UNKNOWN_COLORS: WeatherThemeColors = {
  taskBackground: '#F5F5F5',
  taskBackgroundAlt: '#EBEBEB',
  textPrimary: '#1A1A1A',
  textSecondary: '#4D4D4D',
  border: '#CCCCCC',
  accent: '#666666',
  badgeBackground: '#DDDDDD',
  badgeText: '#1A1A1A',
};

// --- Theme Definitions ---

function buildCssVariables(colors: WeatherThemeColors): Record<string, string> {
  return {
    '--wt-task-bg': colors.taskBackground,
    '--wt-task-bg-alt': colors.taskBackgroundAlt,
    '--wt-text-primary': colors.textPrimary,
    '--wt-text-secondary': colors.textSecondary,
    '--wt-border': colors.border,
    '--wt-accent': colors.accent,
    '--wt-badge-bg': colors.badgeBackground,
    '--wt-badge-text': colors.badgeText,
  };
}

export const WEATHER_THEMES: Record<WeatherCondition, WeatherTheme> = {
  [WeatherCondition.Clear]: {
    id: 'theme-clear',
    condition: WeatherCondition.Clear,
    label: 'Clear',
    icon: '☀️',
    ariaLabel: 'Weather theme: Clear skies',
    colors: CLEAR_COLORS,
    cssVariables: buildCssVariables(CLEAR_COLORS),
  },
  [WeatherCondition.Cloudy]: {
    id: 'theme-cloudy',
    condition: WeatherCondition.Cloudy,
    label: 'Cloudy',
    icon: '☁️',
    ariaLabel: 'Weather theme: Cloudy',
    colors: CLOUDY_COLORS,
    cssVariables: buildCssVariables(CLOUDY_COLORS),
  },
  [WeatherCondition.Rainy]: {
    id: 'theme-rainy',
    condition: WeatherCondition.Rainy,
    label: 'Rainy',
    icon: '🌧️',
    ariaLabel: 'Weather theme: Rainy',
    colors: RAINY_COLORS,
    cssVariables: buildCssVariables(RAINY_COLORS),
  },
  [WeatherCondition.Stormy]: {
    id: 'theme-stormy',
    condition: WeatherCondition.Stormy,
    label: 'Stormy',
    icon: '⛈️',
    ariaLabel: 'Weather theme: Stormy',
    colors: STORMY_COLORS,
    cssVariables: buildCssVariables(STORMY_COLORS),
  },
  [WeatherCondition.Snowy]: {
    id: 'theme-snowy',
    condition: WeatherCondition.Snowy,
    label: 'Snowy',
    icon: '❄️',
    ariaLabel: 'Weather theme: Snowy',
    colors: SNOWY_COLORS,
    cssVariables: buildCssVariables(SNOWY_COLORS),
  },
  [WeatherCondition.ExtremeHeat]: {
    id: 'theme-extreme-heat',
    condition: WeatherCondition.ExtremeHeat,
    label: 'Extreme Heat',
    icon: '🔥',
    ariaLabel: 'Weather theme: Extreme heat',
    colors: EXTREME_HEAT_COLORS,
    cssVariables: buildCssVariables(EXTREME_HEAT_COLORS),
  },
  [WeatherCondition.ExtremeCold]: {
    id: 'theme-extreme-cold',
    condition: WeatherCondition.ExtremeCold,
    label: 'Extreme Cold',
    icon: '🥶',
    ariaLabel: 'Weather theme: Extreme cold',
    colors: EXTREME_COLD_COLORS,
    cssVariables: buildCssVariables(EXTREME_COLD_COLORS),
  },
  [WeatherCondition.Unknown]: {
    id: 'theme-unknown',
    condition: WeatherCondition.Unknown,
    label: 'Unknown',
    icon: '🌡️',
    ariaLabel: 'Weather theme: Conditions unknown',
    colors: UNKNOWN_COLORS,
    cssVariables: buildCssVariables(UNKNOWN_COLORS),
  },
};

/**
 * Get the theme for a given weather condition.
 * Always returns a valid theme (falls back to Unknown).
 */
export function getThemeForCondition(condition: WeatherCondition): WeatherTheme {
  return WEATHER_THEMES[condition] ?? WEATHER_THEMES[WeatherCondition.Unknown];
}

/**
 * Get all available weather themes.
 */
export function getAllThemes(): WeatherTheme[] {
  return Object.values(WEATHER_THEMES);
}
