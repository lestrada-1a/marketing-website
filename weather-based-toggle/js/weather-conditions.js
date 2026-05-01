/**
 * Weather Conditions & Theme Mapping
 *
 * Defines the mapping from weather conditions to color themes.
 * All palettes are designed to be:
 *  - High-contrast (WCAG AA compliant)
 *  - Color-blind-safe (avoids red/green confusion, uses luminance + pattern)
 *  - Accompanied by non-color cues (icons + labels)
 *
 * Weather categories:
 *  clear, cloudy, rainy, stormy, snowy, extreme_heat, extreme_cold, foggy, windy, default
 */

const WeatherConditions = (() => {
  'use strict';

  /**
   * Each condition maps to:
   *  - id: unique key used in data-theme attribute
   *  - label: human-readable name shown to users
   *  - icon: emoji/symbol used as non-color cue (aria-hidden, paired with label)
   *  - description: tooltip/accessible description
   *  - colors: CSS custom property values for the theme
   *    - primary: main accent color
   *    - primaryLight: lighter variant for backgrounds
   *    - primaryDark: darker variant for text/borders
   *    - cardBg: task card background
   *    - cardBorder: task card border
   *    - textPrimary: primary text color
   *    - textSecondary: secondary text color
   *    - headerBg: column header background
   */
  const CONDITIONS = {
    clear: {
      id: 'clear',
      label: 'Clear',
      icon: '☀️',
      description: 'Clear skies — warm sunny theme',
      wmoCodeRanges: [[0, 1]],
      colors: {
        primary: '#D97706',
        primaryLight: '#FEF3C7',
        primaryDark: '#92400E',
        cardBg: '#FFFBEB',
        cardBorder: '#F59E0B',
        textPrimary: '#1C1917',
        textSecondary: '#57534E',
        headerBg: '#FDE68A',
      },
    },

    cloudy: {
      id: 'cloudy',
      label: 'Cloudy',
      icon: '☁️',
      description: 'Cloudy skies — soft neutral theme',
      wmoCodeRanges: [[2, 3]],
      colors: {
        primary: '#6B7280',
        primaryLight: '#F3F4F6',
        primaryDark: '#374151',
        cardBg: '#F9FAFB',
        cardBorder: '#9CA3AF',
        textPrimary: '#111827',
        textSecondary: '#4B5563',
        headerBg: '#E5E7EB',
      },
    },

    foggy: {
      id: 'foggy',
      label: 'Foggy',
      icon: '🌫️',
      description: 'Foggy conditions — muted misty theme',
      wmoCodeRanges: [[45, 48]],
      colors: {
        primary: '#78716C',
        primaryLight: '#F5F5F4',
        primaryDark: '#44403C',
        cardBg: '#FAFAF9',
        cardBorder: '#A8A29E',
        textPrimary: '#1C1917',
        textSecondary: '#57534E',
        headerBg: '#E7E5E4',
      },
    },

    rainy: {
      id: 'rainy',
      label: 'Rainy',
      icon: '🌧️',
      description: 'Rain — cool blue theme',
      wmoCodeRanges: [[51, 67], [80, 82]],
      colors: {
        primary: '#2563EB',
        primaryLight: '#DBEAFE',
        primaryDark: '#1E40AF',
        cardBg: '#EFF6FF',
        cardBorder: '#60A5FA',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        headerBg: '#BFDBFE',
      },
    },

    snowy: {
      id: 'snowy',
      label: 'Snowy',
      icon: '❄️',
      description: 'Snow — crisp icy theme',
      wmoCodeRanges: [[71, 77], [85, 86]],
      colors: {
        primary: '#0891B2',
        primaryLight: '#ECFEFF',
        primaryDark: '#155E75',
        cardBg: '#F0FDFA',
        cardBorder: '#67E8F9',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        headerBg: '#CFFAFE',
      },
    },

    stormy: {
      id: 'stormy',
      label: 'Stormy',
      icon: '⛈️',
      description: 'Thunderstorm — deep dramatic theme',
      wmoCodeRanges: [[95, 99]],
      colors: {
        primary: '#7C3AED',
        primaryLight: '#EDE9FE',
        primaryDark: '#4C1D95',
        cardBg: '#F5F3FF',
        cardBorder: '#A78BFA',
        textPrimary: '#0F0A1A',
        textSecondary: '#4C4063',
        headerBg: '#DDD6FE',
      },
    },

    extreme_heat: {
      id: 'extreme_heat',
      label: 'Extreme Heat',
      icon: '🔥',
      description: 'Extreme heat — bold warm theme',
      wmoCodeRanges: [],
      tempThreshold: { above: 35 },
      colors: {
        primary: '#DC2626',
        primaryLight: '#FEE2E2',
        primaryDark: '#991B1B',
        cardBg: '#FEF2F2',
        cardBorder: '#F87171',
        textPrimary: '#1C1917',
        textSecondary: '#57534E',
        headerBg: '#FECACA',
      },
    },

    extreme_cold: {
      id: 'extreme_cold',
      label: 'Extreme Cold',
      icon: '🥶',
      description: 'Extreme cold — deep blue-grey theme',
      wmoCodeRanges: [],
      tempThreshold: { below: -10 },
      colors: {
        primary: '#1E3A5F',
        primaryLight: '#E0F2FE',
        primaryDark: '#0C1929',
        cardBg: '#F0F9FF',
        cardBorder: '#7DD3FC',
        textPrimary: '#0C1929',
        textSecondary: '#334155',
        headerBg: '#BAE6FD',
      },
    },

    windy: {
      id: 'windy',
      label: 'Windy',
      icon: '💨',
      description: 'Windy conditions — airy teal theme',
      wmoCodeRanges: [],
      windThreshold: { above: 50 },
      colors: {
        primary: '#0D9488',
        primaryLight: '#CCFBF1',
        primaryDark: '#134E4A',
        cardBg: '#F0FDFA',
        cardBorder: '#5EEAD4',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        headerBg: '#99F6E4',
      },
    },

    default: {
      id: 'default',
      label: 'Default',
      icon: '🌤️',
      description: 'Standard theme — no weather data',
      wmoCodeRanges: [],
      colors: {
        primary: '#4F46E5',
        primaryLight: '#EEF2FF',
        primaryDark: '#3730A3',
        cardBg: '#FFFFFF',
        cardBorder: '#E5E7EB',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        headerBg: '#F3F4F6',
      },
    },
  };

  /**
   * Classify weather data into a condition.
   * Uses WMO weather codes from Open-Meteo, plus temperature and wind thresholds.
   *
   * @param {Object} weatherData - { weatherCode, temperature, windSpeed }
   * @returns {Object} The matching condition from CONDITIONS
   */
  function classify(weatherData) {
    if (!weatherData) return CONDITIONS.default;

    const { weatherCode, temperature, windSpeed } = weatherData;

    // Check temperature extremes first
    if (typeof temperature === 'number') {
      if (temperature > 35) return CONDITIONS.extreme_heat;
      if (temperature < -10) return CONDITIONS.extreme_cold;
    }

    // Check wind
    if (typeof windSpeed === 'number' && windSpeed > 50) {
      return CONDITIONS.windy;
    }

    // Match WMO weather code
    if (typeof weatherCode === 'number') {
      for (const [key, condition] of Object.entries(CONDITIONS)) {
        if (key === 'default') continue;
        for (const [min, max] of condition.wmoCodeRanges) {
          if (weatherCode >= min && weatherCode <= max) {
            return condition;
          }
        }
      }
    }

    return CONDITIONS.default;
  }

  /**
   * Get all condition definitions (for theme mapping display).
   */
  function getAllConditions() {
    return { ...CONDITIONS };
  }

  /**
   * Get a specific condition by ID.
   */
  function getCondition(id) {
    return CONDITIONS[id] || CONDITIONS.default;
  }

  return { classify, getAllConditions, getCondition };
})();
