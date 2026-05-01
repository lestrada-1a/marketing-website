/**
 * Weather-Based Theme Toggle - Type Definitions
 *
 * Privacy Note: Location data is used solely to fetch weather conditions.
 * Precise coordinates are never persisted beyond the current session.
 * Only city-level location names may be stored in localStorage for user convenience.
 * No location data is shared with third parties beyond the configured weather API provider.
 */

/** Supported weather condition categories */
export type WeatherCondition =
  | 'clear'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'extreme_heat'
  | 'extreme_cold'
  | 'unknown';

/** Weather data returned from the weather service */
export interface WeatherData {
  condition: WeatherCondition;
  temperature: number; // Celsius
  description: string;
  locationName: string;
  fetchedAt: number; // Unix timestamp ms
  expiresAt: number; // Unix timestamp ms
}

/** Color theme mapped to a weather condition */
export interface WeatherTheme {
  condition: WeatherCondition;
  label: string;
  icon: string; // Emoji or icon identifier for non-color cue
  ariaLabel: string;
  colors: {
    /** Primary background for task cards */
    cardBackground: string;
    /** Secondary/accent background */
    cardBackgroundAlt: string;
    /** Primary text color - WCAG AA compliant against cardBackground */
    textPrimary: string;
    /** Secondary text color */
    textSecondary: string;
    /** Border/accent color */
    accent: string;
    /** Badge/tag background */
    badgeBackground: string;
    /** Badge/tag text */
    badgeText: string;
    /** Page/view background tint */
    viewBackground: string;
  };
}

/** User preferences for weather-based themes */
export interface WeatherThemePreferences {
  /** Global toggle - default is false (off) */
  enabled: boolean;
  /** Per-project/board overrides. Key is project/board ID, value is enabled state */
  projectOverrides: Record<string, boolean>;
  /** Manual location when geolocation is unavailable */
  manualLocation: string | null;
  /** Whether user has granted geolocation permission */
  locationPermission: 'granted' | 'denied' | 'prompt' | 'unavailable';
}

/** Location data - kept minimal for privacy */
export interface LocationData {
  latitude: number;
  longitude: number;
  cityName?: string;
}

/** Cache entry for weather data */
export interface WeatherCacheEntry {
  data: WeatherData;
  locationKey: string; // Rounded coordinates or city name - never precise location
}

/** Status of the weather service */
export type WeatherServiceStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'permission_denied'
  | 'api_unavailable';

/** Props for the weather theme context */
export interface WeatherThemeContextValue {
  /** Current weather data, if available */
  weather: WeatherData | null;
  /** Current theme based on weather */
  theme: WeatherTheme | null;
  /** User preferences */
  preferences: WeatherThemePreferences;
  /** Service status */
  status: WeatherServiceStatus;
  /** Error message if status is error */
  errorMessage: string | null;
  /** Toggle weather theme on/off globally */
  toggleEnabled: () => void;
  /** Set override for a specific project/board */
  setProjectOverride: (projectId: string, enabled: boolean) => void;
  /** Remove override for a specific project/board */
  removeProjectOverride: (projectId: string) => void;
  /** Set manual location */
  setManualLocation: (location: string) => void;
  /** Request geolocation permission */
  requestLocation: () => Promise<void>;
  /** Force refresh weather data */
  refreshWeather: () => Promise<void>;
  /** Check if theme is active for a given project */
  isActiveForProject: (projectId: string) => boolean;
}
