'use client';

/**
 * LocationSettings - Handles location permission and manual location input.
 * Shows when weather theme is enabled but no location is configured.
 */

import React, { useState } from 'react';
import { useWeatherTheme } from '@/context/WeatherThemeContext';

export function LocationSettings() {
  const {
    preferences,
    requestLocation,
    setManualLocation,
    status,
    weather,
  } = useWeatherTheme();

  const [manualInput, setManualInput] = useState(preferences.manualLocation ?? '');
  const [isRequesting, setIsRequesting] = useState(false);

  if (!preferences.enabled) return null;

  const handleRequestLocation = async () => {
    setIsRequesting(true);
    await requestLocation();
    setIsRequesting(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      setManualLocation(manualInput.trim());
    }
  };

  const handleClearLocation = () => {
    setManualInput('');
    setManualLocation('');
  };

  const showLocationSetup =
    !weather &&
    !preferences.manualLocation &&
    preferences.locationPermission !== 'granted';

  return (
    <div className="location-settings" role="region" aria-label="Location settings">
      {/* Current location display */}
      {weather && (
        <div className="location-settings__current">
          <span className="location-settings__label">📍 Location:</span>
          <span className="location-settings__value">{weather.locationName}</span>
          <span className="location-settings__temp">
            {Math.round(weather.temperature)}°C
          </span>
          <button
            className="location-settings__change-btn"
            onClick={handleClearLocation}
            aria-label="Change location"
          >
            Change
          </button>
        </div>
      )}

      {/* Location setup - shown when no location is configured */}
      {showLocationSetup && (
        <div className="location-settings__setup">
          <p className="location-settings__prompt">
            To show weather-based themes, we need your location.
            Your location is only used to fetch weather data and is never stored precisely.
          </p>

          <div className="location-settings__options">
            {/* Geolocation button */}
            {preferences.locationPermission !== 'denied' && (
              <button
                className="location-settings__geo-btn"
                onClick={handleRequestLocation}
                disabled={isRequesting}
                aria-label="Use my current location"
              >
                {isRequesting ? (
                  <>
                    <span aria-hidden="true">⏳</span> Requesting location…
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">📍</span> Use My Location
                  </>
                )}
              </button>
            )}

            {preferences.locationPermission === 'denied' && (
              <div className="location-settings__denied" role="alert">
                <span aria-hidden="true">🔒</span>
                <span>
                  Location access was denied. You can enter your city manually below,
                  or update your browser&apos;s location permissions.
                </span>
              </div>
            )}

            {/* Manual location input */}
            <div className="location-settings__manual">
              <span className="location-settings__divider">or enter a city name:</span>
              <form onSubmit={handleManualSubmit} className="location-settings__form">
                <label htmlFor="manual-location-input" className="sr-only">
                  Enter city name
                </label>
                <input
                  id="manual-location-input"
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g., London, Tokyo, New York"
                  className="location-settings__input"
                  aria-label="City name for weather data"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="location-settings__submit-btn"
                  disabled={!manualInput.trim()}
                  aria-label="Set location"
                >
                  Set Location
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Status messages */}
      {status === 'loading' && (
        <div className="location-settings__status" aria-live="polite">
          Fetching weather data…
        </div>
      )}
    </div>
  );
}
