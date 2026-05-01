/**
 * Weather-Based Theme Toggle - Type Definitions
 *
 * Core types for the weather-based task color theme system.
 */

// --- Weather Conditions ---

export enum WeatherCondition {
  Clear = 'clear',
  Cloudy = 'cloudy',
  Rainy = 'rainy',
  Stormy = 'stormy',
  Snowy = 'snowy',
  ExtremeHeat = 'extreme_heat',
  ExtremeCold = 'extreme_cold',
  Unknown = 'unknown',
}

export interface WeatherData {
  condition: WeatherCondition;
  temperature: number; // Celsius
  description: string;
  icon: string; // Weather icon identifier
  fetchedAt: number; // Unix timestamp (ms)
  expiresAt: number; // Unix timestamp (ms)
}

// --- Location ---

export interface GeoLocation {
  latitude: number;
  longitude: number;
  /** Coarsened for privacy (rounded to ~1km precision) */
  isCoarsened: boolean;
}

export interface ManualLocation {
  city: string;
  country?: string;
}

export type LocationSource =
  | { type: 'geolocation'; location: GeoLocation }
  | { type: 'manual'; location: ManualLocation }
  | { type: 'unavailable' };

export enum LocationPermissionStatus {
  Granted = 'granted',
  Denied = 'denied',
  Prompt = 'prompt',
  Unavailable = 'unavailable',
}

// --- Theme ---

export interface WeatherThemeColors {
  /** Primary background color for task cards */
  taskBackground: string;
  /** Secondary/accent background */
  taskBackgroundAlt: string;
  /** Primary text color */
  textPrimary: string;
  /** Secondary text color */
  textSecondary: string;
  /** Border/divider color */
  border: string;
  /** Accent color for highlights */
  accent: string;
  /** Badge/tag background */
  badgeBackground: string;
  /** Badge/tag text */
  badgeText: string;
}

export interface WeatherTheme {
  id: string;
  condition: WeatherCondition;
  label: string;
  icon: string; // Emoji or icon class for non-color cue
  ariaLabel: string; // Accessible label
  colors: WeatherThemeColors;
  /** CSS custom properties map for easy application */
  cssVariables: Record<string, string>;
}

// --- User Preferences ---

export interface WeatherThemePreferences {
  /** Global toggle - default is false (off) */
  enabled: boolean;
  /** Manual location override (when geolocation unavailable) */
  manualLocation?: ManualLocation;
  /** Per-project overrides: projectId -> enabled/disabled */
  projectOverrides: Record<string, boolean>;
  /** Per-board overrides: boardId -> enabled/disabled */
  boardOverrides: Record<string, boolean>;
  /** Last updated timestamp */
  updatedAt: number;
}

export const DEFAULT_PREFERENCES: WeatherThemePreferences = {
  enabled: false,
  manualLocation: undefined,
  projectOverrides: {},
  boardOverrides: {},
  updatedAt: 0,
};

// --- Cache ---

export interface WeatherCacheEntry {
  key: string; // location-based cache key
  data: WeatherData;
  createdAt: number;
  expiresAt: number;
}

// --- Events ---

export enum WeatherThemeEvent {
  ThemeChanged = 'weather-theme:changed',
  ToggleChanged = 'weather-theme:toggle-changed',
  LocationChanged = 'weather-theme:location-changed',
  WeatherUpdated = 'weather-theme:weather-updated',
  Error = 'weather-theme:error',
  FallbackActivated = 'weather-theme:fallback-activated',
}

export interface WeatherThemeEventPayload {
  [WeatherThemeEvent.ThemeChanged]: { theme: WeatherTheme | null };
  [WeatherThemeEvent.ToggleChanged]: { enabled: boolean };
  [WeatherThemeEvent.LocationChanged]: { source: LocationSource };
  [WeatherThemeEvent.WeatherUpdated]: { data: WeatherData };
  [WeatherThemeEvent.Error]: { error: Error; context: string };
  [WeatherThemeEvent.FallbackActivated]: { reason: string };
}

// --- Weather API ---

export interface WeatherApiConfig {
  /** Base URL for the weather API */
  baseUrl: string;
  /** API key for authentication */
  apiKey: string;
  /** Request timeout in milliseconds */
  timeoutMs: number;
}

export interface WeatherApiResponse {
  condition: WeatherCondition;
  temperature: number;
  description: string;
  icon: string;
}
