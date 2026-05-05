/**
 * UI Controller Module
 *
 * Manages DOM interactions for the weather theme toggle:
 * - Toggle switch with accessible ARIA attributes
 * - Location settings panel (auto-detect + manual city)
 * - Weather status display with non-color cues
 * - Settings panel for per-project/board overrides
 * - Keyboard navigation support
 */

import { getPreferences, savePreferences, clearAllData } from './preferences.js';
import { getBrowserLocation, geocodeCity, getWeather, clearWeatherCache } from './weather-service.js';
import { applyTheme, clearTheme, createWeatherIndicator } from './theme-manager.js';
import { getThemeForCondition, getAllConditions, WeatherCondition } from './weather-conditions.js';

let _refreshInterval = null;

/**
 * Initialize the UI controller. Call after DOM is ready.
 */
export function initUI() {
  const prefs = getPreferences();

  setupToggle(prefs);
  setupLocationPanel(prefs);
  setupSettingsPanel(prefs);
  setupThemePreview();
  insertWeatherIndicators();

  // If already enabled, activate
  if (prefs.enabled) {
    activateWeatherTheme();
  }
}

/**
 * Set up the main toggle switch.
 */
function setupToggle(prefs) {
  const toggle = document.getElementById('weather-toggle');
  if (!toggle) return;

  // Set initial state
  toggle.setAttribute('aria-checked', String(prefs.enabled));
  toggle.setAttribute('role', 'switch');
  toggle.setAttribute('tabindex', '0');
  toggle.classList.toggle('active', prefs.enabled);

  const statusText = toggle.querySelector('.toggle-status-text');
  if (statusText) {
    statusText.textContent = prefs.enabled ? 'On' : 'Off';
  }

  // Click handler
  toggle.addEventListener('click', handleToggleClick);

  // Keyboard handler (Space / Enter)
  toggle.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggleClick();
    }
  });
}

/**
 * Handle toggle click/activation.
 */
function handleToggleClick() {
  const toggle = document.getElementById('weather-toggle');
  const prefs = getPreferences();
  const newEnabled = !prefs.enabled;

  savePreferences({ enabled: newEnabled });

  toggle.setAttribute('aria-checked', String(newEnabled));
  toggle.classList.toggle('active', newEnabled);

  const statusText = toggle.querySelector('.toggle-status-text');
  if (statusText) {
    statusText.textContent = newEnabled ? 'On' : 'Off';
  }

  // Show/hide location panel
  const locationPanel = document.getElementById('location-panel');
  if (locationPanel) {
    locationPanel.hidden = !newEnabled;
  }

  // Show/hide settings panel
  const settingsPanel = document.getElementById('settings-panel');
  if (settingsPanel) {
    settingsPanel.hidden = !newEnabled;
  }

  if (newEnabled) {
    activateWeatherTheme();
  } else {
    deactivateWeatherTheme();
  }

  // Announce state change to screen readers
  announceToScreenReader(`Weather theme ${newEnabled ? 'enabled' : 'disabled'}`);
}

/**
 * Set up the location settings panel.
 */
function setupLocationPanel(prefs) {
  const panel = document.getElementById('location-panel');
  if (!panel) return;

  panel.hidden = !prefs.enabled;

  // Auto-detect button
  const autoBtn = document.getElementById('location-auto-btn');
  if (autoBtn) {
    autoBtn.addEventListener('click', handleAutoLocation);
  }

  // Manual city input
  const cityInput = document.getElementById('location-city-input');
  const cityBtn = document.getElementById('location-city-btn');

  if (cityBtn) {
    cityBtn.addEventListener('click', () => handleManualLocation(cityInput));
  }

  if (cityInput) {
    cityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleManualLocation(cityInput);
      }
    });

    // Pre-fill if we have a saved location
    if (prefs.manualLocation && prefs.manualLocation.city) {
      cityInput.value = prefs.manualLocation.city;
    }
  }

  // Update location display
  updateLocationDisplay(prefs);
}

/**
 * Handle auto-detect location button.
 */
async function handleAutoLocation() {
  const statusEl = document.getElementById('location-status');
  setLocationStatus('Detecting location…', 'info');

  try {
    const coords = await getBrowserLocation();
    savePreferences({ manualLocation: { ...coords, city: 'Current Location' } });
    setLocationStatus('📍 Using your current location', 'success');
    activateWeatherTheme();
  } catch (error) {
    setLocationStatus(error.message, 'error');
  }
}

/**
 * Handle manual city location.
 */
async function handleManualLocation(cityInput) {
  if (!cityInput) return;

  const cityName = cityInput.value.trim();
  if (!cityName) {
    setLocationStatus('Please enter a city name', 'error');
    cityInput.focus();
    return;
  }

  setLocationStatus('Looking up city…', 'info');

  try {
    const location = await geocodeCity(cityName);
    savePreferences({ manualLocation: location });
    setLocationStatus(`📍 ${location.name}, ${location.country}`, 'success');
    clearWeatherCache(); // Clear cache when location changes
    activateWeatherTheme();
  } catch (error) {
    setLocationStatus(error.message, 'error');
  }
}

/**
 * Update the location status message.
 */
function setLocationStatus(message, type) {
  const statusEl = document.getElementById('location-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `location-status location-status--${type}`;
  statusEl.setAttribute('role', 'status');
}

/**
 * Update location display on load.
 */
function updateLocationDisplay(prefs) {
  if (prefs.manualLocation) {
    const city = prefs.manualLocation.city || 'Current Location';
    const country = prefs.manualLocation.country || '';
    const display = country ? `${city}, ${country}` : city;
    setLocationStatus(`📍 ${display}`, 'success');
  }
}

/**
 * Activate the weather theme — fetch weather and apply.
 */
async function activateWeatherTheme() {
  const prefs = getPreferences();

  if (!prefs.enabled) return;
  if (!prefs.manualLocation) {
    updateWeatherDisplay(null, 'Set a location to see weather themes');
    return;
  }

  updateWeatherDisplay(null, 'Loading weather…');

  try {
    const weather = await getWeather(prefs.manualLocation.lat, prefs.manualLocation.lon);
    applyTheme(weather.condition);
    updateWeatherDisplay(weather);

    // Set up periodic refresh
    startPeriodicRefresh(prefs.manualLocation.lat, prefs.manualLocation.lon);
  } catch (error) {
    console.warn('[WeatherTheme] Failed to fetch weather:', error);
    clearTheme();
    updateWeatherDisplay(null, 'Weather unavailable — using default theme');
  }
}

/**
 * Deactivate the weather theme.
 */
function deactivateWeatherTheme() {
  clearTheme();
  clearAllData();
  stopPeriodicRefresh();
  updateWeatherDisplay(null, '');

  // Reset location display
  const statusEl = document.getElementById('location-status');
  if (statusEl) {
    statusEl.textContent = '';
    statusEl.className = 'location-status';
  }

  // Reset city input
  const cityInput = document.getElementById('location-city-input');
  if (cityInput) cityInput.value = '';
}

/**
 * Update the weather display section with current conditions.
 * This is a key accessibility feature — shows icon + text label as non-color cues.
 */
function updateWeatherDisplay(weather, fallbackMessage = '') {
  const displayEl = document.getElementById('weather-display');
  if (!displayEl) return;

  if (!weather) {
    displayEl.innerHTML = fallbackMessage
      ? `<p class="weather-display__message">${escapeHtml(fallbackMessage)}</p>`
      : '';
    displayEl.setAttribute('aria-label', fallbackMessage || 'No weather data');
    return;
  }

  const theme = getThemeForCondition(weather.condition);
  const tempStr = weather.temperature !== null ? `${Math.round(weather.temperature)}°C` : '';
  const windStr = weather.windSpeed !== null ? `${Math.round(weather.windSpeed)} km/h wind` : '';

  displayEl.innerHTML = `
    <div class="weather-display__card" role="region" aria-label="${theme.ariaLabel}">
      <div class="weather-display__condition">
        <span class="weather-display__icon" aria-hidden="true">${theme.icon}</span>
        <span class="weather-display__label">${escapeHtml(theme.label)}</span>
      </div>
      <div class="weather-display__details">
        ${tempStr ? `<span class="weather-display__temp" aria-label="Temperature: ${tempStr}">${tempStr}</span>` : ''}
        ${windStr ? `<span class="weather-display__wind" aria-label="Wind: ${windStr}">${windStr}</span>` : ''}
      </div>
      <div class="weather-display__badge" aria-hidden="true">
        <span class="weather-badge__icon">${theme.icon}</span>
        <span class="weather-badge__text">${escapeHtml(theme.label)}</span>
      </div>
    </div>
  `;

  displayEl.setAttribute('aria-label', theme.ariaLabel);
}

/**
 * Set up the settings panel for per-project/board overrides.
 */
function setupSettingsPanel(prefs) {
  const panel = document.getElementById('settings-panel');
  if (!panel) return;

  panel.hidden = !prefs.enabled;

  // Project override controls
  const addProjectBtn = document.getElementById('add-project-override-btn');
  if (addProjectBtn) {
    addProjectBtn.addEventListener('click', () => {
      const input = document.getElementById('project-override-input');
      if (input && input.value.trim()) {
        import('./preferences.js').then(({ setProjectOverride }) => {
          setProjectOverride(input.value.trim(), false);
          input.value = '';
        });
      }
    });
  }
}

/**
 * Set up the theme preview grid showing all available themes.
 * Each preview tile shows icon + label + color swatch for accessible identification.
 */
function setupThemePreview() {
  const container = document.getElementById('theme-preview-grid');
  if (!container) return;

  const conditions = getAllConditions();

  container.innerHTML = conditions.map((item) => `
    <div class="theme-preview-tile"
         style="background-color: ${item.colors.background}; border-color: ${item.colors.border};"
         role="listitem"
         aria-label="${item.ariaLabel}">
      <div class="theme-preview-tile__header">
        <span class="theme-preview-tile__icon" aria-hidden="true">${item.icon}</span>
        <span class="theme-preview-tile__label" style="color: ${item.colors.text};">${escapeHtml(item.label)}</span>
      </div>
      <div class="theme-preview-tile__swatch">
        <span class="swatch" style="background-color: ${item.colors.accent};" aria-hidden="true"></span>
        <span class="swatch" style="background-color: ${item.colors.surface};" aria-hidden="true"></span>
        <span class="swatch" style="background-color: ${item.colors.border};" aria-hidden="true"></span>
      </div>
    </div>
  `).join('');
}

/**
 * Insert weather status indicators into task-like demo elements.
 */
function insertWeatherIndicators() {
  const taskCards = document.querySelectorAll('.task-card');
  taskCards.forEach((card) => {
    if (!card.querySelector('.weather-status-indicator')) {
      const indicator = createWeatherIndicator();
      const header = card.querySelector('.task-card__header');
      if (header) {
        header.appendChild(indicator);
      }
    }
  });
}

/**
 * Start periodic weather refresh.
 */
function startPeriodicRefresh(lat, lon) {
  stopPeriodicRefresh();
  _refreshInterval = setInterval(async () => {
    try {
      const weather = await getWeather(lat, lon);
      const prefs = getPreferences();
      if (prefs.enabled) {
        applyTheme(weather.condition);
        updateWeatherDisplay(weather);
      }
    } catch (e) {
      // Silently ignore refresh errors
    }
  }, 20 * 60 * 1000); // 20 minutes
}

/**
 * Stop periodic refresh.
 */
function stopPeriodicRefresh() {
  if (_refreshInterval) {
    clearInterval(_refreshInterval);
    _refreshInterval = null;
  }
}

/**
 * Announce a message to screen readers via a live region.
 */
function announceToScreenReader(message) {
  let announcer = document.getElementById('sr-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }

  announcer.textContent = '';
  // Force a DOM reflow so the screen reader picks up the change
  void announcer.offsetHeight;
  announcer.textContent = message;
}

/**
 * Escape HTML to prevent XSS.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
