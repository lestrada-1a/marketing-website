/**
 * Weather Theme Controller
 *
 * The main orchestrator that ties together all weather theme subsystems:
 * - Location detection
 * - Weather data fetching + caching
 * - Theme mapping and application
 * - User preferences
 * - Event emission
 * - Graceful degradation
 *
 * Usage:
 *   const controller = new WeatherThemeController({ apiKey: 'YOUR_KEY' });
 *   await controller.initialize();
 *   // Theme is now applied if enabled
 */

import { WeatherThemeEventEmitter } from './event-emitter';
import {
  locationToCacheKey,
  resolveLocation,
} from './location-service';
import { PreferencesManager } from './preferences';
import { getThemeForCondition } from './themes';
import { WeatherCache } from './weather-cache';
import { createFallbackWeatherData, fetchWeatherData } from './weather-api';
import {
  LocationSource,
  WeatherApiConfig,
  WeatherCondition,
  WeatherData,
  WeatherTheme,
  WeatherThemeEvent,
} from './types';

export interface WeatherThemeControllerOptions {
  /** Weather API key */
  apiKey: string;
  /** Weather API base URL (optional, defaults to OpenWeatherMap) */
  apiBaseUrl?: string;
  /** API request timeout in ms (default: 10000) */
  apiTimeoutMs?: number;
  /** Cache TTL in ms (default: 20 minutes) */
  cacheTtlMs?: number;
  /** Auto-refresh interval in ms (default: 20 minutes, 0 to disable) */
  refreshIntervalMs?: number;
  /** CSS selector for the container to apply theme variables to (default: ':root') */
  themeTarget?: string;
}

export class WeatherThemeController {
  private readonly preferences: PreferencesManager;
  private readonly cache: WeatherCache;
  private readonly emitter: WeatherThemeEventEmitter;
  private readonly apiConfig: Partial<WeatherApiConfig>;
  private readonly themeTarget: string;
  private readonly refreshIntervalMs: number;

  private currentLocation: LocationSource = { type: 'unavailable' };
  private currentWeather: WeatherData | null = null;
  private currentTheme: WeatherTheme | null = null;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private initialized = false;

  constructor(options: WeatherThemeControllerOptions) {
    this.preferences = new PreferencesManager();
    this.cache = new WeatherCache({ ttlMs: options.cacheTtlMs });
    this.emitter = new WeatherThemeEventEmitter();
    this.themeTarget = options.themeTarget ?? ':root';
    this.refreshIntervalMs = options.refreshIntervalMs ?? 20 * 60 * 1000;

    this.apiConfig = {
      apiKey: options.apiKey,
      baseUrl: options.apiBaseUrl,
      timeoutMs: options.apiTimeoutMs,
    };
  }

  // --- Public API ---

  /**
   * Initialize the controller: resolve location, fetch weather, apply theme.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    // Listen for preference changes
    this.preferences.onChange(() => {
      this.onPreferencesChanged();
    });

    if (this.preferences.isEnabled()) {
      await this.refresh();
      this.startAutoRefresh();
    }
  }

  /**
   * Enable or disable the weather theme globally.
   */
  async setEnabled(enabled: boolean): Promise<void> {
    const wasEnabled = this.preferences.isEnabled();
    this.preferences.setEnabled(enabled);

    this.emitter.emit(WeatherThemeEvent.ToggleChanged, { enabled });

    if (enabled && !wasEnabled) {
      await this.refresh();
      this.startAutoRefresh();
    } else if (!enabled) {
      this.removeTheme();
      this.stopAutoRefresh();
    }
  }

  /**
   * Check if the weather theme is currently enabled.
   */
  isEnabled(): boolean {
    return this.preferences.isEnabled();
  }

  /**
   * Check if the weather theme is enabled for a specific context.
   */
  isEnabledForContext(context: { projectId?: string; boardId?: string }): boolean {
    if (!this.preferences.isEnabled()) return false;

    if (context.boardId) {
      return this.preferences.isEnabledForBoard(context.boardId);
    }
    if (context.projectId) {
      return this.preferences.isEnabledForProject(context.projectId);
    }
    return true;
  }

  /**
   * Set a per-project override.
   */
  setProjectOverride(projectId: string, enabled: boolean | undefined): void {
    this.preferences.setProjectOverride(projectId, enabled);
  }

  /**
   * Set a per-board override.
   */
  setBoardOverride(boardId: string, enabled: boolean | undefined): void {
    this.preferences.setBoardOverride(boardId, enabled);
  }

  /**
   * Set a manual location (fallback when geolocation is unavailable).
   */
  async setManualLocation(city: string, country?: string): Promise<void> {
    this.preferences.setManualLocation(
      city ? { city, country } : undefined
    );

    if (this.preferences.isEnabled()) {
      await this.refresh();
    }
  }

  /**
   * Force a refresh of weather data and theme.
   */
  async refresh(): Promise<void> {
    try {
      // Resolve location
      const location = await resolveLocation(
        this.preferences.getManualLocation()
      );
      this.currentLocation = location;
      this.emitter.emit(WeatherThemeEvent.LocationChanged, { source: location });

      if (location.type === 'unavailable') {
        this.applyFallback('Location unavailable');
        return;
      }

      // Check cache
      const cacheKey = locationToCacheKey(location);
      const cachedData = this.cache.get(cacheKey);

      if (cachedData) {
        this.applyWeatherData(cachedData);
        return;
      }

      // Rate-limit check
      if (!this.cache.canFetch(cacheKey)) {
        // Use stale data or fallback
        if (this.currentWeather) {
          this.applyWeatherData(this.currentWeather);
        } else {
          this.applyFallback('Rate limited — using default theme');
        }
        return;
      }

      // Fetch fresh data
      this.cache.recordFetchAttempt(cacheKey);
      const weatherData = await fetchWeatherData(location, this.apiConfig);
      this.cache.set(cacheKey, weatherData);
      this.applyWeatherData(weatherData);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emitter.emit(WeatherThemeEvent.Error, {
        error: err,
        context: 'refresh',
      });
      this.applyFallback(`Weather data unavailable: ${err.message}`);
    }
  }

  /**
   * Get the currently active theme (or null if disabled/fallback).
   */
  getCurrentTheme(): WeatherTheme | null {
    return this.currentTheme;
  }

  /**
   * Get the current weather data (or null if unavailable).
   */
  getCurrentWeather(): WeatherData | null {
    return this.currentWeather;
  }

  /**
   * Get the current location source.
   */
  getCurrentLocation(): LocationSource {
    return this.currentLocation;
  }

  /**
   * Get the preferences manager for direct access.
   */
  getPreferences(): PreferencesManager {
    return this.preferences;
  }

  /**
   * Subscribe to weather theme events.
   */
  on<E extends WeatherThemeEvent>(
    event: E,
    handler: (payload: import('./types').WeatherThemeEventPayload[E]) => void
  ): () => void {
    return this.emitter.on(event, handler);
  }

  /**
   * Clean up: stop timers, remove theme, clear listeners.
   */
  destroy(): void {
    this.stopAutoRefresh();
    this.removeTheme();
    this.emitter.removeAllListeners();
    this.initialized = false;
  }

  // --- Private Methods ---

  private applyWeatherData(data: WeatherData): void {
    this.currentWeather = data;
    this.emitter.emit(WeatherThemeEvent.WeatherUpdated, { data });

    const theme = getThemeForCondition(data.condition);
    this.applyTheme(theme);
  }

  private applyTheme(theme: WeatherTheme): void {
    this.currentTheme = theme;

    // Apply CSS custom properties
    if (typeof document !== 'undefined') {
      const target =
        this.themeTarget === ':root'
          ? document.documentElement
          : document.querySelector(this.themeTarget);

      if (target) {
        // Set theme data attributes for non-color cues
        (target as HTMLElement).setAttribute('data-weather-theme', theme.id);
        (target as HTMLElement).setAttribute('data-weather-condition', theme.condition);
        (target as HTMLElement).setAttribute('data-weather-label', theme.label);
        (target as HTMLElement).setAttribute('data-weather-icon', theme.icon);

        // Apply CSS variables
        Object.entries(theme.cssVariables).forEach(([prop, value]) => {
          (target as HTMLElement).style.setProperty(prop, value);
        });
      }
    }

    this.emitter.emit(WeatherThemeEvent.ThemeChanged, { theme });
  }

  private removeTheme(): void {
    this.currentTheme = null;

    if (typeof document !== 'undefined') {
      const target =
        this.themeTarget === ':root'
          ? document.documentElement
          : document.querySelector(this.themeTarget);

      if (target) {
        (target as HTMLElement).removeAttribute('data-weather-theme');
        (target as HTMLElement).removeAttribute('data-weather-condition');
        (target as HTMLElement).removeAttribute('data-weather-label');
        (target as HTMLElement).removeAttribute('data-weather-icon');

        // Remove CSS variables
        const cssVarNames = [
          '--wt-task-bg',
          '--wt-task-bg-alt',
          '--wt-text-primary',
          '--wt-text-secondary',
          '--wt-border',
          '--wt-accent',
          '--wt-badge-bg',
          '--wt-badge-text',
        ];
        cssVarNames.forEach((prop) => {
          (target as HTMLElement).style.removeProperty(prop);
        });
      }
    }

    this.emitter.emit(WeatherThemeEvent.ThemeChanged, { theme: null });
  }

  private applyFallback(reason: string): void {
    this.currentWeather = createFallbackWeatherData();
    this.removeTheme();
    this.emitter.emit(WeatherThemeEvent.FallbackActivated, { reason });
  }

  private startAutoRefresh(): void {
    if (this.refreshIntervalMs <= 0) return;
    this.stopAutoRefresh();

    this.refreshTimer = setInterval(() => {
      if (this.preferences.isEnabled()) {
        this.refresh().catch(() => {
          // Errors are handled inside refresh()
        });
      }
    }, this.refreshIntervalMs);
  }

  private stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private onPreferencesChanged(): void {
    if (!this.preferences.isEnabled()) {
      this.removeTheme();
      this.stopAutoRefresh();
    }
  }
}
