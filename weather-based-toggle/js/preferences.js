/**
 * User Preferences Module
 *
 * Manages storage of user preferences in localStorage.
 * Handles:
 *  - Global weather theme toggle (default: off)
 *  - Per-project/board overrides
 *  - Manual location setting
 *  - Privacy: only stores city-level location, can be cleared at any time
 *
 * Storage keys (all prefixed with 'wt_'):
 *  - wt_enabled: boolean - global toggle state
 *  - wt_location: { lat, lon, name, source } - location data (rounded coords)
 *  - wt_project_overrides: { [projectId]: boolean } - per-project toggles
 *  - wt_last_updated: ISO timestamp of last preference change
 */

const Preferences = (() => {
  'use strict';

  const STORAGE_PREFIX = 'wt_';
  const KEYS = {
    ENABLED: `${STORAGE_PREFIX}enabled`,
    LOCATION: `${STORAGE_PREFIX}location`,
    PROJECT_OVERRIDES: `${STORAGE_PREFIX}project_overrides`,
    LAST_UPDATED: `${STORAGE_PREFIX}last_updated`,
  };

  /**
   * Safely read from localStorage.
   */
  function _read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  /**
   * Safely write to localStorage.
   */
  function _write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      localStorage.setItem(KEYS.LAST_UPDATED, new Date().toISOString());
    } catch (e) {
      console.warn('Preferences: unable to write to localStorage', e);
    }
  }

  /**
   * Check if weather theme is enabled globally.
   * Default: false (off for all users).
   */
  function isEnabled() {
    return _read(KEYS.ENABLED, false);
  }

  /**
   * Set global weather theme toggle.
   */
  function setEnabled(enabled) {
    _write(KEYS.ENABLED, !!enabled);
  }

  /**
   * Get stored location data.
   * @returns {{ lat: number, lon: number, name: string, source: string } | null}
   */
  function getLocation() {
    return _read(KEYS.LOCATION, null);
  }

  /**
   * Store location data.
   * Rounds coordinates to ~1km precision for privacy.
   *
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {string} name - Display name (city)
   * @param {string} source - 'gps' | 'manual'
   */
  function setLocation(lat, lon, name, source) {
    // Round to 2 decimal places (~1.1km precision) for privacy
    const roundedLat = Math.round(lat * 100) / 100;
    const roundedLon = Math.round(lon * 100) / 100;

    _write(KEYS.LOCATION, {
      lat: roundedLat,
      lon: roundedLon,
      name: name || `${roundedLat}, ${roundedLon}`,
      source: source || 'manual',
    });
  }

  /**
   * Get per-project override settings.
   * @returns {Object} Map of projectId -> boolean (true = enabled, false = disabled)
   */
  function getProjectOverrides() {
    return _read(KEYS.PROJECT_OVERRIDES, {});
  }

  /**
   * Set override for a specific project.
   * @param {string} projectId
   * @param {boolean|null} enabled - true/false to override, null to remove override
   */
  function setProjectOverride(projectId, enabled) {
    const overrides = getProjectOverrides();
    if (enabled === null || enabled === undefined) {
      delete overrides[projectId];
    } else {
      overrides[projectId] = !!enabled;
    }
    _write(KEYS.PROJECT_OVERRIDES, overrides);
  }

  /**
   * Check if weather theme is active for a given project.
   * Respects: project override > global toggle.
   *
   * @param {string} projectId
   * @returns {boolean}
   */
  function isEnabledForProject(projectId) {
    const globalEnabled = isEnabled();
    const overrides = getProjectOverrides();

    if (projectId && overrides.hasOwnProperty(projectId)) {
      return overrides[projectId];
    }
    return globalEnabled;
  }

  /**
   * Clear all weather-related stored data.
   */
  function clearAll() {
    Object.values(KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore
      }
    });
    // Also clear cached weather data
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}weather_cache`);
    } catch {
      // Ignore
    }
  }

  return {
    isEnabled,
    setEnabled,
    getLocation,
    setLocation,
    getProjectOverrides,
    setProjectOverride,
    isEnabledForProject,
    clearAll,
    STORAGE_PREFIX,
  };
})();
