/**
 * Weather Conditions & Accessible Theme Definitions
 *
 * Each weather condition maps to a color theme designed to be:
 * - WCAG AA compliant (minimum 4.5:1 contrast ratio for text)
 * - Color-blind safe (distinguishable under protanopia, deuteranopia, tritanopia)
 * - Accompanied by non-color cues (icon + text label)
 *
 * Color palette strategy:
 * - Uses hue, saturation AND lightness variation (not hue alone)
 * - Avoids problematic red/green-only distinctions
 * - Each theme has a unique pattern/texture option for additional differentiation
 */

export const WeatherCondition = Object.freeze({
  CLEAR: 'clear',
  CLOUDY: 'cloudy',
  FOGGY: 'foggy',
  RAINY: 'rainy',
  SNOWY: 'snowy',
  STORMY: 'stormy',
  EXTREME_HEAT: 'extreme_heat',
  EXTREME_COLD: 'extreme_cold',
  WINDY: 'windy',
  UNKNOWN: 'unknown',
});

/**
 * Theme definitions keyed by WeatherCondition.
 *
 * Color choices rationale:
 * - Each theme uses a distinct hue AND lightness level so themes remain
 *   distinguishable even in greyscale or under any form of color vision deficiency.
 * - Primary background is light; accent is bold; text is always dark enough for AA.
 * - icon: emoji used as a quick non-color visual cue
 * - label: human-readable text label (the primary non-color cue)
 * - ariaLabel: screen-reader-friendly description
 */
export const WEATHER_THEMES = Object.freeze({
  [WeatherCondition.CLEAR]: {
    id: 'clear',
    label: 'Clear',
    icon: '☀️',
    ariaLabel: 'Weather: Clear skies',
    colors: {
      background: '#FFF9E6',      // warm ivory
      surface: '#FFF3CC',         // light gold
      accent: '#7A5A00',          // dark gold-brown (AA compliant: 4.5:1+ on white)
      accentText: '#FFFFFF',      // white on accent
      text: '#3D2E00',            // dark brown
      textSecondary: '#6B5300',   // medium brown
      border: '#C49A10',          // gold border
      focusRing: '#5C4300',       // darker gold for focus
    },
    pattern: 'radial-gradient(circle at 80% 20%, rgba(122,90,0,0.08) 0%, transparent 50%)',
  },

  [WeatherCondition.CLOUDY]: {
    id: 'cloudy',
    label: 'Cloudy',
    icon: '☁️',
    ariaLabel: 'Weather: Cloudy',
    colors: {
      background: '#F0F2F5',      // cool light grey
      surface: '#E4E7EC',         // medium grey
      accent: '#5A6578',          // slate blue-grey (AA compliant)
      accentText: '#FFFFFF',
      text: '#1A1F2B',            // near-black
      textSecondary: '#4A5064',   // dark grey
      border: '#8A92A3',          // medium slate
      focusRing: '#3D4559',       // dark slate
    },
    pattern: 'linear-gradient(135deg, rgba(90,101,120,0.04) 25%, transparent 25%)',
  },

  [WeatherCondition.FOGGY]: {
    id: 'foggy',
    label: 'Foggy',
    icon: '🌫️',
    ariaLabel: 'Weather: Foggy conditions',
    colors: {
      background: '#F5F3F0',      // warm off-white
      surface: '#EBE8E3',         // warm light grey
      accent: '#7A7268',          // warm taupe (AA compliant)
      accentText: '#FFFFFF',
      text: '#2D2A25',            // dark warm grey
      textSecondary: '#5C574E',   // medium taupe
      border: '#9E968B',          // light taupe
      focusRing: '#524C43',       // dark taupe
    },
    pattern: 'repeating-linear-gradient(0deg, rgba(122,114,104,0.03) 0px, rgba(122,114,104,0.03) 2px, transparent 2px, transparent 6px)',
  },

  [WeatherCondition.RAINY]: {
    id: 'rainy',
    label: 'Rainy',
    icon: '🌧️',
    ariaLabel: 'Weather: Rainy',
    colors: {
      background: '#E8F0FA',      // pale blue
      surface: '#D4E4F5',         // light blue
      accent: '#2B6CB0',          // strong blue (AA compliant)
      accentText: '#FFFFFF',
      text: '#0D2137',            // very dark blue
      textSecondary: '#1A4971',   // dark blue
      border: '#5A9BD5',          // medium blue
      focusRing: '#1A4971',       // dark blue
    },
    pattern: 'repeating-linear-gradient(170deg, rgba(43,108,176,0.05) 0px, transparent 3px, transparent 8px)',
  },

  [WeatherCondition.SNOWY]: {
    id: 'snowy',
    label: 'Snowy',
    icon: '❄️',
    ariaLabel: 'Weather: Snowy',
    colors: {
      background: '#EDF5FF',      // ice white-blue
      surface: '#DAEAF8',         // light ice
      accent: '#4878A8',          // steel blue (AA compliant)
      accentText: '#FFFFFF',
      text: '#0F2640',            // dark navy
      textSecondary: '#2D5A8A',   // medium navy
      border: '#7BADD4',          // light steel
      focusRing: '#2D5A8A',       // medium navy
    },
    pattern: 'radial-gradient(circle at 30% 30%, rgba(72,120,168,0.06) 0%, transparent 40%)',
  },

  [WeatherCondition.STORMY]: {
    id: 'stormy',
    label: 'Stormy',
    icon: '⛈️',
    ariaLabel: 'Weather: Stormy conditions',
    colors: {
      background: '#E8E4F0',      // pale purple-grey
      surface: '#D5CFE0',         // light purple-grey
      accent: '#6B4C9A',          // deep purple (AA compliant)
      accentText: '#FFFFFF',
      text: '#1E1230',            // very dark purple
      textSecondary: '#4A3570',   // dark purple
      border: '#8B72B0',          // medium purple
      focusRing: '#4A3570',       // dark purple
    },
    pattern: 'linear-gradient(160deg, rgba(107,76,154,0.06) 0%, transparent 60%)',
  },

  [WeatherCondition.EXTREME_HEAT]: {
    id: 'extreme_heat',
    label: 'Extreme Heat',
    icon: '🔥',
    ariaLabel: 'Weather: Extreme heat warning',
    colors: {
      background: '#FFF0E8',      // pale peach
      surface: '#FFE0CC',         // light orange
      accent: '#C44B00',          // burnt orange (AA compliant)
      accentText: '#FFFFFF',
      text: '#3D1600',            // very dark brown
      textSecondary: '#7A2E00',   // dark orange-brown
      border: '#E87030',          // medium orange
      focusRing: '#7A2E00',       // dark orange-brown
    },
    pattern: 'linear-gradient(0deg, rgba(196,75,0,0.04) 0%, transparent 40%)',
  },

  [WeatherCondition.EXTREME_COLD]: {
    id: 'extreme_cold',
    label: 'Extreme Cold',
    icon: '🥶',
    ariaLabel: 'Weather: Extreme cold warning',
    colors: {
      background: '#E6F2F8',      // pale cyan
      surface: '#CCE5F0',         // light cyan
      accent: '#1B7A8A',          // dark teal (AA compliant)
      accentText: '#FFFFFF',
      text: '#082830',            // very dark teal
      textSecondary: '#0E5460',   // dark teal
      border: '#4AA0B0',          // medium teal
      focusRing: '#0E5460',       // dark teal
    },
    pattern: 'repeating-linear-gradient(90deg, rgba(27,122,138,0.04) 0px, rgba(27,122,138,0.04) 1px, transparent 1px, transparent 5px)',
  },

  [WeatherCondition.WINDY]: {
    id: 'windy',
    label: 'Windy',
    icon: '💨',
    ariaLabel: 'Weather: Windy',
    colors: {
      background: '#EDF5F0',      // pale mint-green
      surface: '#D8EBE0',         // light sage
      accent: '#3A7D5C',          // forest green (AA compliant)
      accentText: '#FFFFFF',
      text: '#0D2818',            // very dark green
      textSecondary: '#245A3C',   // dark green
      border: '#6AAD88',          // medium green
      focusRing: '#245A3C',       // dark green
    },
    pattern: 'repeating-linear-gradient(45deg, rgba(58,125,92,0.04) 0px, transparent 4px, transparent 10px)',
  },

  [WeatherCondition.UNKNOWN]: {
    id: 'unknown',
    label: 'Default',
    icon: '🌡️',
    ariaLabel: 'Weather: Unable to determine conditions',
    colors: {
      background: '#F5F5F5',      // neutral light grey
      surface: '#EBEBEB',         // neutral grey
      accent: '#555555',          // medium grey (AA compliant)
      accentText: '#FFFFFF',
      text: '#1A1A1A',            // near-black
      textSecondary: '#4D4D4D',   // dark grey
      border: '#999999',          // medium grey
      focusRing: '#333333',       // dark grey
    },
    pattern: 'none',
  },
});

/**
 * Map Open-Meteo WMO weather codes to our weather conditions.
 * Reference: https://open-meteo.com/en/docs
 *
 * WMO Code ranges:
 * 0        = Clear sky
 * 1-3      = Mainly clear, partly cloudy, overcast
 * 45,48    = Fog / depositing rime fog
 * 51-57    = Drizzle (light to freezing)
 * 61-67    = Rain (slight to freezing)
 * 71-77    = Snowfall (slight to heavy) & snow grains
 * 80-82    = Rain showers
 * 85-86    = Snow showers
 * 95       = Thunderstorm
 * 96,99    = Thunderstorm with hail
 */
export function classifyWeatherCode(wmoCode, temperature = null) {
  // Extreme temperature overrides (when available)
  if (temperature !== null) {
    if (temperature >= 40) return WeatherCondition.EXTREME_HEAT;
    if (temperature <= -15) return WeatherCondition.EXTREME_COLD;
  }

  if (wmoCode === 0) return WeatherCondition.CLEAR;
  if (wmoCode >= 1 && wmoCode <= 3) return WeatherCondition.CLOUDY;
  if (wmoCode === 45 || wmoCode === 48) return WeatherCondition.FOGGY;
  if (wmoCode >= 51 && wmoCode <= 57) return WeatherCondition.RAINY;
  if (wmoCode >= 61 && wmoCode <= 67) return WeatherCondition.RAINY;
  if (wmoCode >= 71 && wmoCode <= 77) return WeatherCondition.SNOWY;
  if (wmoCode >= 80 && wmoCode <= 82) return WeatherCondition.RAINY;
  if (wmoCode >= 85 && wmoCode <= 86) return WeatherCondition.SNOWY;
  if (wmoCode === 95 || wmoCode === 96 || wmoCode === 99) return WeatherCondition.STORMY;

  return WeatherCondition.UNKNOWN;
}

/**
 * Get theme definition for a given weather condition.
 */
export function getThemeForCondition(condition) {
  return WEATHER_THEMES[condition] || WEATHER_THEMES[WeatherCondition.UNKNOWN];
}

/**
 * Get all available weather conditions with their display info
 * (useful for settings panels and previews).
 */
export function getAllConditions() {
  return Object.values(WeatherCondition).map((condition) => ({
    condition,
    ...WEATHER_THEMES[condition],
  }));
}
