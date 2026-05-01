/**
 * User Preferences Manager
 *
 * Manages user preferences for the weather-based theme toggle:
 * - Global enable/disable toggle (default: off)
 * - Manual location settings
 * - Per-project and per-board overrides
 *
 * Preferences are persisted to localStorage and can be synced
 * to a backend user settings API if available.
 */

import {
  DEFAULT_PREFERENCES,
  ManualLocation,
  WeatherThemePreferences,
} from './types';

const STORAGE_KEY = 'weather-theme-preferences';

export class PreferencesManager {
  private preferences: WeatherThemePreferences;
  private listeners: Array<(prefs: WeatherThemePreferences) => void> = [];

  constructor() {
    this.preferences = this.load();
  }

  /**
   * Get current preferences.
   */
  getPreferences(): Readonly<WeatherThemePreferences> {
    return { ...this.preferences };
  }

  /**
   * Check if the weather theme is enabled globally.
   */
  isEnabled(): boolean {
    return this.preferences.enabled;
  }

  /**
   * Set the global enable/disable toggle.
   */
  setEnabled(enabled: boolean): void {
    this.preferences.enabled = enabled;
    this.save();
  }

  /**
   * Set a manual location for weather data.
   */
  setManualLocation(location: ManualLocation | undefined): void {
    this.preferences.manualLocation = location;
    this.save();
  }

  /**
   * Get the stored manual location.
   */
  getManualLocation(): ManualLocation | undefined {
    return this.preferences.manualLocation;
  }

  /**
   * Check if the weather theme is enabled for a specific project.
   * Returns the project-specific override if set, otherwise the global setting.
   */
  isEnabledForProject(projectId: string): boolean {
    const override = this.preferences.projectOverrides[projectId];
    return override !== undefined ? override : this.preferences.enabled;
  }

  /**
   * Set a per-project override.
   * @param projectId - The project identifier
   * @param enabled - true to enable, false to disable, undefined to remove override
   */
  setProjectOverride(projectId: string, enabled: boolean | undefined): void {
    if (enabled === undefined) {
      delete this.preferences.projectOverrides[projectId];
    } else {
      this.preferences.projectOverrides[projectId] = enabled;
    }
    this.save();
  }

  /**
   * Check if the weather theme is enabled for a specific board.
   * Returns the board-specific override if set, otherwise the global setting.
   */
  isEnabledForBoard(boardId: string): boolean {
    const override = this.preferences.boardOverrides[boardId];
    return override !== undefined ? override : this.preferences.enabled;
  }

  /**
   * Set a per-board override.
   * @param boardId - The board identifier
   * @param enabled - true to enable, false to disable, undefined to remove override
   */
  setBoardOverride(boardId: string, enabled: boolean | undefined): void {
    if (enabled === undefined) {
      delete this.preferences.boardOverrides[boardId];
    } else {
      this.preferences.boardOverrides[boardId] = enabled;
    }
    this.save();
  }

  /**
   * Get all project overrides.
   */
  getProjectOverrides(): Readonly<Record<string, boolean>> {
    return { ...this.preferences.projectOverrides };
  }

  /**
   * Get all board overrides.
   */
  getBoardOverrides(): Readonly<Record<string, boolean>> {
    return { ...this.preferences.boardOverrides };
  }

  /**
   * Clear all per-project and per-board overrides.
   */
  clearOverrides(): void {
    this.preferences.projectOverrides = {};
    this.preferences.boardOverrides = {};
    this.save();
  }

  /**
   * Reset all preferences to defaults.
   */
  reset(): void {
    this.preferences = {
      enabled: DEFAULT_PREFERENCES.enabled,
      manualLocation: undefined,
      projectOverrides: {},
      boardOverrides: {},
      updatedAt: Date.now(),
    };
    this.save();
  }

  /**
   * Subscribe to preference changes.
   * Returns an unsubscribe function.
   */
  onChange(listener: (prefs: WeatherThemePreferences) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // --- Persistence ---

  private save(): void {
    this.preferences.updatedAt = Date.now();

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
      } catch {
        // Storage full or unavailable — silently continue
      }
    }

    // Notify listeners
    const snapshot = { ...this.preferences };
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch {
        // Prevent listener errors from breaking the save flow
      }
    });
  }

  private load(): WeatherThemePreferences {
    if (typeof localStorage === 'undefined') {
      return { ...DEFAULT_PREFERENCES };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_PREFERENCES };

      const parsed = JSON.parse(raw) as Partial<WeatherThemePreferences>;
      return {
        enabled: parsed.enabled ?? DEFAULT_PREFERENCES.enabled,
        manualLocation: parsed.manualLocation,
        projectOverrides: parsed.projectOverrides ?? {},
        boardOverrides: parsed.boardOverrides ?? {},
        updatedAt: parsed.updatedAt ?? 0,
      };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }
}
