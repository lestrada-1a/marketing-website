/**
 * Theme Manager Module
 *
 * Applies weather-based color themes to the document by setting CSS custom properties.
 * Handles:
 *  - Applying/removing theme CSS variables
 *  - Managing data-theme attribute on <body>
 *  - Smooth theme transitions
 *  - Fallback to default theme on errors
 */

const ThemeManager = (() => {
  'use strict';

  let _currentThemeId = 'default';
  let _transitionTimeout = null;

  /**
   * Apply a weather condition's theme to the document.
   * Sets CSS custom properties on <body> and updates data-theme attribute.
   *
   * @param {Object} condition - A condition object from WeatherConditions
   * @param {boolean} animate - Whether to animate the transition
   */
  function applyTheme(condition, animate = true) {
    if (!condition || !condition.colors) {
      condition = WeatherConditions.getCondition('default');
    }

    const body = document.body;

    // Add transition class for smooth color change
    if (animate) {
      body.classList.add('theme-transitioning');
      clearTimeout(_transitionTimeout);
      _transitionTimeout = setTimeout(() => {
        body.classList.remove('theme-transitioning');
      }, 600);
    }

    // Set CSS custom properties
    const colors = condition.colors;
    body.style.setProperty('--theme-primary', colors.primary);
    body.style.setProperty('--theme-primary-light', colors.primaryLight);
    body.style.setProperty('--theme-primary-dark', colors.primaryDark);
    body.style.setProperty('--theme-card-bg', colors.cardBg);
    body.style.setProperty('--theme-card-border', colors.cardBorder);
    body.style.setProperty('--theme-text-primary', colors.textPrimary);
    body.style.setProperty('--theme-text-secondary', colors.textSecondary);
    body.style.setProperty('--theme-header-bg', colors.headerBg);

    // Set the data-theme attribute
    body.setAttribute('data-theme', condition.id);
    _currentThemeId = condition.id;
  }

  /**
   * Remove weather theme and revert to default.
   */
  function resetToDefault() {
    applyTheme(WeatherConditions.getCondition('default'), true);
  }

  /**
   * Get the currently active theme ID.
   * @returns {string}
   */
  function getCurrentThemeId() {
    return _currentThemeId;
  }

  /**
   * Apply theme based on weather data.
   * Classifies weather and applies the matching theme.
   *
   * @param {Object} weatherData - Raw weather data from WeatherService
   * @returns {Object} The applied condition
   */
  function applyFromWeatherData(weatherData) {
    const condition = WeatherConditions.classify(weatherData);
    applyTheme(condition);
    return condition;
  }

  return {
    applyTheme,
    resetToDefault,
    getCurrentThemeId,
    applyFromWeatherData,
  };
})();
