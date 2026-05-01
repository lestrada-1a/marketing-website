/**
 * Weather-Based Theme Toggle
 *
 * A modular system for applying weather-based color themes to task views.
 *
 * Quick Start:
 *   import { WeatherThemeController } from './weather-theme';
 *
 *   const controller = new WeatherThemeController({ apiKey: 'YOUR_KEY' });
 *   await controller.initialize();
 *
 * Features:
 * - User-facing toggle (default: off)
 * - Geolocation with manual fallback
 * - Accessible, color-blind-safe palettes
 * - Non-color cues (icons + labels)
 * - Weather data caching (20-minute TTL)
 * - Per-project and per-board overrides
 * - Graceful degradation on API failure
 * - Privacy-safe location handling
 */

// Core types
export {
  WeatherCondition,
  WeatherData,
  GeoLocation,
  ManualLocation,
  LocationSource,
  LocationPermissionStatus,
  WeatherThemeColors,
  WeatherTheme,
  WeatherThemePreferences,
  DEFAULT_PREFERENCES,
  WeatherCacheEntry,
  WeatherThemeEvent,
  WeatherThemeEventPayload,
  WeatherApiConfig,
  WeatherApiResponse,
} from './types';

// Theme mapping
export {
  WEATHER_THEMES,
  getThemeForCondition,
  getAllThemes,
} from './themes';

// Location service
export {
  checkPermissionStatus,
  requestGeolocation,
  createManualLocation,
  resolveLocation,
  locationToCacheKey,
} from './location-service';

// Weather API
export {
  fetchWeatherData,
  createFallbackWeatherData,
} from './weather-api';

// Caching
export { WeatherCache } from './weather-cache';
export type { WeatherCacheOptions } from './weather-cache';

// Preferences
export { PreferencesManager } from './preferences';

// Event emitter
export { WeatherThemeEventEmitter } from './event-emitter';

// Main controller
export {
  WeatherThemeController,
} from './theme-controller';
export type { WeatherThemeControllerOptions } from './theme-controller';

// UI components
export { createWeatherThemeToggle } from './ui/weather-theme-toggle';
export type { WeatherThemeToggleOptions } from './ui/weather-theme-toggle';
