/**
 * Weather Theme Toggle UI Component
 *
 * A self-contained, accessible toggle switch that enables/disables
 * the weather-based task color themes. Renders as a web component-style
 * DOM element with:
 * - Toggle switch (default: off)
 * - Current weather icon + label (non-color cue)
 * - Status indicator for errors/fallback
 * - Manual location input (shown when geolocation is unavailable)
 *
 * Accessibility:
 * - Uses proper ARIA roles and attributes
 * - Keyboard navigable (Space/Enter to toggle)
 * - Screen reader announcements for state changes
 * - High-contrast focus indicators
 */

import { WeatherThemeController } from '../theme-controller';
import {
  LocationPermissionStatus,
  WeatherThemeEvent,
} from '../types';
import { checkPermissionStatus } from '../location-service';

export interface WeatherThemeToggleOptions {
  /** The controller instance to bind to */
  controller: WeatherThemeController;
  /** CSS class prefix for styling (default: 'wt') */
  classPrefix?: string;
  /** Show the manual location input (default: auto-detect) */
  showLocationInput?: boolean | 'auto';
}

/**
 * Create and mount the weather theme toggle UI.
 *
 * @param container - The DOM element to render into
 * @param options - Configuration options
 * @returns Cleanup function to unmount the component
 */
export function createWeatherThemeToggle(
  container: HTMLElement,
  options: WeatherThemeToggleOptions
): () => void {
  const { controller, classPrefix = 'wt' } = options;
  const cls = (name: string) => `${classPrefix}-${name}`;
  const unsubscribers: Array<() => void> = [];

  // --- Build DOM ---

  const wrapper = document.createElement('div');
  wrapper.className = cls('toggle-wrapper');
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Weather theme settings');

  // Toggle row
  const toggleRow = document.createElement('div');
  toggleRow.className = cls('toggle-row');

  const label = document.createElement('label');
  label.className = cls('toggle-label');
  label.setAttribute('for', `${cls('toggle-input')}`);
  label.textContent = 'Weather Theme';

  const toggleSwitch = document.createElement('button');
  toggleSwitch.id = `${cls('toggle-input')}`;
  toggleSwitch.className = cls('toggle-switch');
  toggleSwitch.setAttribute('role', 'switch');
  toggleSwitch.setAttribute('aria-checked', String(controller.isEnabled()));
  toggleSwitch.setAttribute('aria-label', 'Enable weather-based task color theme');
  toggleSwitch.setAttribute('type', 'button');

  const toggleTrack = document.createElement('span');
  toggleTrack.className = cls('toggle-track');
  const toggleThumb = document.createElement('span');
  toggleThumb.className = cls('toggle-thumb');
  toggleTrack.appendChild(toggleThumb);
  toggleSwitch.appendChild(toggleTrack);

  toggleRow.appendChild(label);
  toggleRow.appendChild(toggleSwitch);

  // Status display
  const statusRow = document.createElement('div');
  statusRow.className = cls('status-row');
  statusRow.setAttribute('aria-live', 'polite');
  statusRow.setAttribute('role', 'status');

  const weatherIcon = document.createElement('span');
  weatherIcon.className = cls('weather-icon');
  weatherIcon.setAttribute('aria-hidden', 'true');

  const weatherLabel = document.createElement('span');
  weatherLabel.className = cls('weather-label');

  const statusMessage = document.createElement('span');
  statusMessage.className = cls('status-message');

  statusRow.appendChild(weatherIcon);
  statusRow.appendChild(weatherLabel);
  statusRow.appendChild(statusMessage);

  // Manual location input
  const locationRow = document.createElement('div');
  locationRow.className = cls('location-row');
  locationRow.style.display = 'none';

  const locationLabel = document.createElement('label');
  locationLabel.className = cls('location-label');
  locationLabel.setAttribute('for', `${cls('location-input')}`);
  locationLabel.textContent = 'Location:';

  const locationInput = document.createElement('input');
  locationInput.id = `${cls('location-input')}`;
  locationInput.className = cls('location-input');
  locationInput.type = 'text';
  locationInput.placeholder = 'Enter city name (e.g., London, UK)';
  locationInput.setAttribute('aria-label', 'Enter your city for weather data');

  const locationButton = document.createElement('button');
  locationButton.className = cls('location-button');
  locationButton.textContent = 'Set';
  locationButton.setAttribute('type', 'button');
  locationButton.setAttribute('aria-label', 'Set location for weather data');

  locationRow.appendChild(locationLabel);
  locationRow.appendChild(locationInput);
  locationRow.appendChild(locationButton);

  // Per-context override info
  const overrideInfo = document.createElement('div');
  overrideInfo.className = cls('override-info');
  overrideInfo.style.display = 'none';

  // Assemble
  wrapper.appendChild(toggleRow);
  wrapper.appendChild(statusRow);
  wrapper.appendChild(locationRow);
  wrapper.appendChild(overrideInfo);

  container.appendChild(wrapper);

  // --- State Updates ---

  function updateToggleState(enabled: boolean): void {
    toggleSwitch.setAttribute('aria-checked', String(enabled));
    toggleSwitch.classList.toggle(`${cls('toggle-switch')}--active`, enabled);
    statusRow.style.display = enabled ? '' : 'none';
  }

  function updateWeatherDisplay(): void {
    const theme = controller.getCurrentTheme();
    const weather = controller.getCurrentWeather();

    if (theme) {
      weatherIcon.textContent = theme.icon;
      weatherLabel.textContent = `${theme.label}${
        weather ? ` · ${Math.round(weather.temperature)}°C` : ''
      }`;
      weatherLabel.setAttribute('aria-label', theme.ariaLabel);
    } else {
      weatherIcon.textContent = '';
      weatherLabel.textContent = '';
    }
  }

  async function updateLocationInput(): Promise<void> {
    const showSetting = options.showLocationInput ?? 'auto';
    if (showSetting === false) {
      locationRow.style.display = 'none';
      return;
    }

    if (showSetting === true) {
      locationRow.style.display = controller.isEnabled() ? '' : 'none';
      return;
    }

    // Auto mode: show if geolocation is not granted
    if (!controller.isEnabled()) {
      locationRow.style.display = 'none';
      return;
    }

    const permStatus = await checkPermissionStatus();
    locationRow.style.display =
      permStatus === LocationPermissionStatus.Denied ||
      permStatus === LocationPermissionStatus.Unavailable
        ? ''
        : 'none';

    // Pre-fill with stored manual location
    const manualLoc = controller.getPreferences().getManualLocation();
    if (manualLoc) {
      locationInput.value = manualLoc.country
        ? `${manualLoc.city}, ${manualLoc.country}`
        : manualLoc.city;
    }
  }

  // --- Event Handlers ---

  toggleSwitch.addEventListener('click', async () => {
    const newState = !controller.isEnabled();
    await controller.setEnabled(newState);
    updateToggleState(newState);
    await updateLocationInput();
  });

  toggleSwitch.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleSwitch.click();
    }
  });

  locationButton.addEventListener('click', async () => {
    const value = locationInput.value.trim();
    if (!value) return;

    const parts = value.split(',').map((s) => s.trim());
    const city = parts[0];
    const country = parts[1] || undefined;

    statusMessage.textContent = 'Updating...';
    await controller.setManualLocation(city, country);
    statusMessage.textContent = '';
    updateWeatherDisplay();
  });

  locationInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      locationButton.click();
    }
  });

  // Subscribe to controller events
  unsubscribers.push(
    controller.on(WeatherThemeEvent.ThemeChanged, () => {
      updateWeatherDisplay();
    })
  );

  unsubscribers.push(
    controller.on(WeatherThemeEvent.FallbackActivated, ({ reason }) => {
      statusMessage.textContent = reason;
      // Clear after 10 seconds
      setTimeout(() => {
        if (statusMessage.textContent === reason) {
          statusMessage.textContent = '';
        }
      }, 10000);
    })
  );

  unsubscribers.push(
    controller.on(WeatherThemeEvent.Error, ({ error }) => {
      statusMessage.textContent = `⚠ ${error.message}`;
      setTimeout(() => {
        statusMessage.textContent = '';
      }, 10000);
    })
  );

  // --- Initial Render ---

  updateToggleState(controller.isEnabled());
  updateWeatherDisplay();
  updateLocationInput();

  // --- Cleanup ---

  return () => {
    unsubscribers.forEach((unsub) => unsub());
    container.removeChild(wrapper);
  };
}
