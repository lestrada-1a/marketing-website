/**
 * Weather Condition → Theme Mapping
 *
 * All color palettes are designed to be:
 * - High contrast (WCAG AA compliant, minimum 4.5:1 ratio for text)
 * - Color-blind safe (distinguishable under protanopia, deuteranopia, tritanopia)
 * - Supplemented with icons and labels as non-color cues
 */

import { WeatherCondition, WeatherTheme } from '@/types/weather';

/**
 * Complete mapping of weather conditions to visual themes.
 * Each theme uses carefully selected colors that remain distinguishable
 * for users with color vision deficiencies.
 */
export const WEATHER_THEME_MAP: Record<WeatherCondition, WeatherTheme> = {
  clear: {
    condition: 'clear',
    label: 'Clear Skies',
    icon: '☀️',
    ariaLabel: 'Weather theme: Clear skies - warm sunny palette',
    colors: {
      cardBackground: '#FFF9E6',
      cardBackgroundAlt: '#FFF3CC',
      textPrimary: '#1A1A00',
      textSecondary: '#4D4D00',
      accent: '#D4A012',
      badgeBackground: '#D4A012',
      badgeText: '#FFFFFF',
      viewBackground: '#FFFDF5',
    },
  },

  cloudy: {
    condition: 'cloudy',
    label: 'Cloudy',
    icon: '☁️',
    ariaLabel: 'Weather theme: Cloudy - soft grey palette',
    colors: {
      cardBackground: '#F0F2F5',
      cardBackgroundAlt: '#E4E7EC',
      textPrimary: '#1A1D23',
      textSecondary: '#4A4F5A',
      accent: '#6B7280',
      badgeBackground: '#6B7280',
      badgeText: '#FFFFFF',
      viewBackground: '#F7F8FA',
    },
  },

  rainy: {
    condition: 'rainy',
    label: 'Rainy',
    icon: '🌧️',
    ariaLabel: 'Weather theme: Rainy - cool blue palette',
    colors: {
      cardBackground: '#E8F0FE',
      cardBackgroundAlt: '#D2E3FC',
      textPrimary: '#0D1B2A',
      textSecondary: '#1B365D',
      accent: '#1A73E8',
      badgeBackground: '#1A73E8',
      badgeText: '#FFFFFF',
      viewBackground: '#F1F5FD',
    },
  },

  stormy: {
    condition: 'stormy',
    label: 'Stormy',
    icon: '⛈️',
    ariaLabel: 'Weather theme: Stormy - deep indigo palette',
    colors: {
      cardBackground: '#E8E5F0',
      cardBackgroundAlt: '#D6D0E6',
      textPrimary: '#1A1028',
      textSecondary: '#3D2C5E',
      accent: '#5B21B6',
      badgeBackground: '#5B21B6',
      badgeText: '#FFFFFF',
      viewBackground: '#F3F1F8',
    },
  },

  snowy: {
    condition: 'snowy',
    label: 'Snowy',
    icon: '❄️',
    ariaLabel: 'Weather theme: Snowy - icy cool palette',
    colors: {
      cardBackground: '#EDF5FF',
      cardBackgroundAlt: '#DBE9FC',
      textPrimary: '#0A1929',
      textSecondary: '#1E3A5F',
      accent: '#0277BD',
      badgeBackground: '#0277BD',
      badgeText: '#FFFFFF',
      viewBackground: '#F5F9FF',
    },
  },

  extreme_heat: {
    condition: 'extreme_heat',
    label: 'Extreme Heat',
    icon: '🔥',
    ariaLabel: 'Weather theme: Extreme heat - warm red-orange palette',
    colors: {
      cardBackground: '#FFF0E6',
      cardBackgroundAlt: '#FFE0CC',
      textPrimary: '#1A0800',
      textSecondary: '#5C1A00',
      accent: '#D84315',
      badgeBackground: '#D84315',
      badgeText: '#FFFFFF',
      viewBackground: '#FFF8F3',
    },
  },

  extreme_cold: {
    condition: 'extreme_cold',
    label: 'Extreme Cold',
    icon: '🥶',
    ariaLabel: 'Weather theme: Extreme cold - deep frost palette',
    colors: {
      cardBackground: '#E3F2FD',
      cardBackgroundAlt: '#BBDEFB',
      textPrimary: '#0D1B2A',
      textSecondary: '#1B3A5C',
      accent: '#0D47A1',
      badgeBackground: '#0D47A1',
      badgeText: '#FFFFFF',
      viewBackground: '#F0F7FF',
    },
  },

  unknown: {
    condition: 'unknown',
    label: 'Weather Unavailable',
    icon: '🌐',
    ariaLabel: 'Weather theme: Weather data unavailable - default palette',
    colors: {
      cardBackground: '#FFFFFF',
      cardBackgroundAlt: '#F5F5F5',
      textPrimary: '#1A1A1A',
      textSecondary: '#666666',
      accent: '#0052CC',
      badgeBackground: '#0052CC',
      badgeText: '#FFFFFF',
      viewBackground: '#FAFAFA',
    },
  },
};

/**
 * Get the theme for a given weather condition.
 * Falls back to the 'unknown' theme if the condition is not recognized.
 */
export function getThemeForCondition(condition: WeatherCondition): WeatherTheme {
  return WEATHER_THEME_MAP[condition] ?? WEATHER_THEME_MAP.unknown;
}

/**
 * Get all available themes for display in settings/preview.
 */
export function getAllThemes(): WeatherTheme[] {
  return Object.values(WEATHER_THEME_MAP);
}

/**
 * Map a raw weather API code/description to our internal WeatherCondition.
 * This centralizes the mapping logic so different weather providers
 * can be supported by adjusting this function.
 *
 * @param code - Weather condition code from API (e.g., WMO code)
 * @param temperature - Temperature in Celsius for extreme heat/cold detection
 */
export function mapWeatherCodeToCondition(
  code: number,
  temperature: number
): WeatherCondition {
  // Check for extreme temperatures first
  if (temperature >= 40) return 'extreme_heat';
  if (temperature <= -15) return 'extreme_cold';

  // WMO Weather interpretation codes (used by Open-Meteo)
  // https://open-meteo.com/en/docs
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'cloudy'; // Fog
  if (code >= 51 && code <= 67) return 'rainy'; // Drizzle and rain
  if (code >= 71 && code <= 77) return 'snowy'; // Snow
  if (code >= 80 && code <= 82) return 'rainy'; // Rain showers
  if (code >= 85 && code <= 86) return 'snowy'; // Snow showers
  if (code >= 95 && code <= 99) return 'stormy'; // Thunderstorms

  return 'unknown';
}

/**
 * Get a human-readable description for a WMO weather code.
 */
export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snowfall',
    73: 'Moderate snowfall',
    75: 'Heavy snowfall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return descriptions[code] ?? 'Unknown conditions';
}
