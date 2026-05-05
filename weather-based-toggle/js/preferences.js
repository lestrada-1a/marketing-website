/**
 * User Preferences Module
 *
 * Persists user settings to localStorage:
 * - Global toggle (default: off)
 * - Manual location (city name)
 * - Per-project / per-board overrides
 */

const STORAGE_KEY = 'weather-theme-preferences';

const DEFAULT_PREFERENCES = Object.freeze({
  enabled: false,
  manualLocation: null,        // { city: string, lat: number, lon: number } | null
  projectOverrides: {},        // { [projectId]: boolean }
  boardOverrides: {},          // { [boardId]: boolean }
  lastUpdated: null,
});

let _cache = null;

/**
 * Read preferences from localStorage, with defaults.
 */
export function getPreferences() {
  if (_cache) return { ..._cache };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      _cache = { ...DEFAULT_PREFERENCES, ...parsed };
      return { ..._cache };
    }
  } catch (e) {
    console.warn('[Preferences] Failed to read preferences:', e);
  }

  _cache = { ...DEFAULT_PREFERENCES };
  return { ..._cache };
}

/**
 * Save (merge) preferences to localStorage.
 */
export function savePreferences(updates) {
  const current = getPreferences();
  const merged = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    _cache = merged;
  } catch (e) {
    console.warn('[Preferences] Failed to save preferences:', e);
  }

  return { ...merged };
}

/**
 * Check if the weather theme is enabled for a given context.
 * Priority: board override > project override > global toggle
 */
export function isEnabledForContext(projectId = null, boardId = null) {
  const prefs = getPreferences();

  // Global toggle is master switch
  if (!prefs.enabled) return false;

  // Board-level override
  if (boardId && boardId in prefs.boardOverrides) {
    return prefs.boardOverrides[boardId];
  }

  // Project-level override
  if (projectId && projectId in prefs.projectOverrides) {
    return prefs.projectOverrides[projectId];
  }

  return prefs.enabled;
}

/**
 * Set a per-project override.
 */
export function setProjectOverride(projectId, enabled) {
  const prefs = getPreferences();
  const projectOverrides = { ...prefs.projectOverrides, [projectId]: enabled };
  return savePreferences({ projectOverrides });
}

/**
 * Set a per-board override.
 */
export function setBoardOverride(boardId, enabled) {
  const prefs = getPreferences();
  const boardOverrides = { ...prefs.boardOverrides, [boardId]: enabled };
  return savePreferences({ boardOverrides });
}

/**
 * Remove a per-project override (revert to global).
 */
export function clearProjectOverride(projectId) {
  const prefs = getPreferences();
  const projectOverrides = { ...prefs.projectOverrides };
  delete projectOverrides[projectId];
  return savePreferences({ projectOverrides });
}

/**
 * Remove a per-board override (revert to project or global).
 */
export function clearBoardOverride(boardId) {
  const prefs = getPreferences();
  const boardOverrides = { ...prefs.boardOverrides };
  delete boardOverrides[boardId];
  return savePreferences({ boardOverrides });
}

/**
 * Clear all preferences and cached weather data on disable.
 */
export function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('weather-theme-cache');
    _cache = null;
  } catch (e) {
    console.warn('[Preferences] Failed to clear data:', e);
  }
}

/**
 * Invalidate the in-memory cache (useful for testing).
 */
export function invalidateCache() {
  _cache = null;
}
