/**
 * Theme Manager Module
 *
 * Applies weather themes by setting CSS custom properties on a target element.
 * Also manages the weather status indicator (non-color cue).
 */

import { getThemeForCondition, WEATHER_THEMES, WeatherCondition } from './weather-conditions.js';

const CSS_VAR_PREFIX = '--wt-';

/**
 * Apply a weather theme to the document root.
 * Sets CSS custom properties and data attributes for styling hooks.
 */
export function applyTheme(condition) {
  const theme = getThemeForCondition(condition);
  const root = document.documentElement;

  // Set CSS custom properties for all theme colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `${CSS_VAR_PREFIX}${camelToKebab(key)}`;
    root.style.setProperty(cssVar, value);
  });

  // Set pattern
  root.style.setProperty(`${CSS_VAR_PREFIX}pattern`, theme.pattern);

  // Set data attribute for CSS selector hooks
  root.setAttribute('data-weather-theme', theme.id);

  // Update any weather status indicators in the DOM
  updateWeatherIndicators(theme);

  return theme;
}

/**
 * Remove all weather theme styling from the document.
 */
export function clearTheme() {
  const root = document.documentElement;
  const defaultTheme = WEATHER_THEMES[WeatherCondition.UNKNOWN];

  // Remove CSS custom properties
  Object.keys(defaultTheme.colors).forEach((key) => {
    const cssVar = `${CSS_VAR_PREFIX}${camelToKebab(key)}`;
    root.style.removeProperty(cssVar);
  });

  root.style.removeProperty(`${CSS_VAR_PREFIX}pattern`);
  root.removeAttribute('data-weather-theme');

  // Clear indicators
  const indicators = document.querySelectorAll('.weather-status-indicator');
  indicators.forEach((el) => {
    el.setAttribute('aria-hidden', 'true');
    el.style.display = 'none';
  });
}

/**
 * Update all weather status indicator elements in the DOM.
 * These provide the critical non-color cue for accessibility.
 */
function updateWeatherIndicators(theme) {
  const indicators = document.querySelectorAll('.weather-status-indicator');
  indicators.forEach((el) => {
    el.style.display = '';
    el.setAttribute('aria-hidden', 'false');

    const iconEl = el.querySelector('.weather-status-icon');
    const labelEl = el.querySelector('.weather-status-label');

    if (iconEl) iconEl.textContent = theme.icon;
    if (labelEl) labelEl.textContent = theme.label;

    // Set aria-label on the indicator for screen readers
    el.setAttribute('aria-label', theme.ariaLabel);
  });
}

/**
 * Create a weather status indicator element.
 * This is the primary non-color cue — an icon + text label
 * that communicates the weather state independently of color.
 */
export function createWeatherIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'weather-status-indicator';
  indicator.setAttribute('role', 'status');
  indicator.setAttribute('aria-live', 'polite');
  indicator.setAttribute('aria-hidden', 'true');
  indicator.style.display = 'none';

  indicator.innerHTML = `
    <span class="weather-status-icon" aria-hidden="true"></span>
    <span class="weather-status-label"></span>
  `;

  return indicator;
}

/**
 * Convert camelCase to kebab-case for CSS custom property names.
 */
function camelToKebab(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}
