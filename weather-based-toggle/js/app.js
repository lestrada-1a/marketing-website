/**
 * App Entry Point
 *
 * Initializes all modules and coordinates the weather-based theme toggle feature.
 * Orchestrates:
 *  - Loading saved preferences
 *  - Fetching weather data
 *  - Applying themes
 *  - Handling user interactions
 *  - Periodic weather updates (bounded frequency)
 *  - Graceful degradation on errors
 */

(function () {
  'use strict';

  // Periodic weather update interval (30 minutes)
  const UPDATE_INTERVAL_MS = 30 * 60 * 1000;
  let _updateTimer = null;

  /**
   * Main initialization.
   */
  function init() {
    // Initialize UI with callbacks
    UIController.init({
      onToggleChange: handleToggleChange,
      onDetectLocation: handleDetectLocation,
      onSetManualLocation: handleSetManualLocation,
      onClearData: handleClearData,
      onProjectFilterChange: handleProjectFilterChange,
    });

    // Load saved state
    const enabled = Preferences.isEnabled();
    UIController.syncToggleState(enabled);

    // Show saved location if available
    const location = Preferences.getLocation();
    if (location) {
      UIController.updateLocationStatus(`📍 ${location.name} (${location.source})`, 'success');
    }

    // Render project overrides
    UIController.renderProjectOverrides(handleProjectOverrideChange);

    // Render task board
    UIController.renderTaskBoard('all');

    // If enabled, fetch weather and apply theme
    if (enabled && location) {
      fetchAndApplyWeather();
      _startPeriodicUpdates();
    } else {
      ThemeManager.resetToDefault();
    }
  }

  /**
   * Handle global toggle change.
   */
  function handleToggleChange(enabled) {
    Preferences.setEnabled(enabled);
    UIController.syncToggleState(enabled);

    if (enabled) {
      const location = Preferences.getLocation();
      if (location) {
        fetchAndApplyWeather();
        _startPeriodicUpdates();
      } else {
        UIController.showStatusBanner(
          'Weather theme enabled! Set your location in settings to see weather-based colors.',
          'info'
        );
        ThemeManager.resetToDefault();
      }
    } else {
      ThemeManager.resetToDefault();
      UIController.updateWeatherStatus(null, null);
      _stopPeriodicUpdates();
      UIController.showStatusBanner('Weather theme disabled. Using standard colors.', 'info');
    }

    // Re-render task board to reflect theme changes
    const currentFilter = document.getElementById('projectFilter').value;
    UIController.renderTaskBoard(currentFilter);
  }

  /**
   * Handle location detection via Geolocation API.
   */
  async function handleDetectLocation() {
    UIController.setLocationLoading(true);
    UIController.updateLocationStatus('Requesting location access...', 'info');

    try {
      const coords = await WeatherService.requestGeolocation();

      // Reverse-geocode to get city name (use Open-Meteo geocoding in reverse isn't available,
      // so we store coordinates with a generic label, then fetch weather)
      const locationName = `${coords.lat.toFixed(2)}°, ${coords.lon.toFixed(2)}°`;
      Preferences.setLocation(coords.lat, coords.lon, locationName, 'gps');

      UIController.updateLocationStatus(`📍 Location detected: ${locationName}`, 'success');

      // If toggle is on, fetch weather
      if (Preferences.isEnabled()) {
        await fetchAndApplyWeather();
        _startPeriodicUpdates();
      }
    } catch (error) {
      UIController.updateLocationStatus(error.message, 'error');
    } finally {
      UIController.setLocationLoading(false);
    }
  }

  /**
   * Handle manual location input.
   */
  async function handleSetManualLocation(cityName) {
    if (!cityName || !cityName.trim()) {
      UIController.updateLocationStatus('Please enter a city name.', 'error');
      return;
    }

    UIController.setLocationLoading(true);
    UIController.updateLocationStatus(`Looking up "${cityName}"...`, 'info');

    try {
      const geo = await WeatherService.geocodeCity(cityName);
      Preferences.setLocation(geo.lat, geo.lon, geo.name, 'manual');

      UIController.updateLocationStatus(`📍 Location set: ${geo.name}`, 'success');

      // If toggle is on, fetch weather
      if (Preferences.isEnabled()) {
        await fetchAndApplyWeather();
        _startPeriodicUpdates();
      }
    } catch (error) {
      UIController.updateLocationStatus(error.message, 'error');
    } finally {
      UIController.setLocationLoading(false);
    }
  }

  /**
   * Handle project override change.
   */
  function handleProjectOverrideChange(projectId, enabled) {
    Preferences.setProjectOverride(projectId, enabled);
    UIController.renderProjectOverrides(handleProjectOverrideChange);

    // Re-render task board to reflect per-project theme
    const currentFilter = document.getElementById('projectFilter').value;
    UIController.renderTaskBoard(currentFilter);
  }

  /**
   * Handle project filter change in task view.
   */
  function handleProjectFilterChange(projectId) {
    // Task board is already re-rendered by the UI controller
  }

  /**
   * Handle clearing all data.
   */
  function handleClearData() {
    Preferences.clearAll();
    WeatherService.clearCache();
    ThemeManager.resetToDefault();
    _stopPeriodicUpdates();

    UIController.syncToggleState(false);
    UIController.updateWeatherStatus(null, null);
    UIController.updateWeatherPreview(null, null);
    UIController.updateLocationStatus('All weather data cleared.', 'info');
    UIController.renderProjectOverrides(handleProjectOverrideChange);
    UIController.showStatusBanner('All weather data has been cleared.', 'info');

    // Re-render task board
    const currentFilter = document.getElementById('projectFilter').value;
    UIController.renderTaskBoard(currentFilter);
  }

  /**
   * Fetch weather data and apply the corresponding theme.
   * Handles errors gracefully by falling back to default theme.
   */
  async function fetchAndApplyWeather(forceRefresh = false) {
    try {
      const weatherData = await WeatherService.getWeather(forceRefresh);

      if (!weatherData) {
        // No data available — fall back to default
        ThemeManager.resetToDefault();
        UIController.updateWeatherStatus(null, null);
        UIController.updateWeatherPreview(null, null);
        return;
      }

      // Classify and apply theme
      const condition = ThemeManager.applyFromWeatherData(weatherData);

      // Update UI indicators
      UIController.updateWeatherStatus(condition, weatherData);
      UIController.updateWeatherPreview(condition, weatherData);

      // Show stale data warning if applicable
      if (weatherData.stale) {
        UIController.showStatusBanner(
          'Weather service temporarily unavailable. Showing cached weather data.',
          'warning'
        );
      }

      // Re-render task board with new theme state
      const currentFilter = document.getElementById('projectFilter').value;
      UIController.renderTaskBoard(currentFilter);
    } catch (error) {
      console.error('Weather fetch error:', error);

      // Graceful degradation: fall back to default theme
      ThemeManager.resetToDefault();
      UIController.showStatusBanner(
        'Unable to fetch weather data. Using standard theme.',
        'warning'
      );
    }
  }

  /**
   * Start periodic weather updates.
   */
  function _startPeriodicUpdates() {
    _stopPeriodicUpdates();
    _updateTimer = setInterval(() => {
      if (Preferences.isEnabled() && Preferences.getLocation()) {
        fetchAndApplyWeather(true);
      }
    }, UPDATE_INTERVAL_MS);
  }

  /**
   * Stop periodic weather updates.
   */
  function _stopPeriodicUpdates() {
    if (_updateTimer) {
      clearInterval(_updateTimer);
      _updateTimer = null;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
