'use client';

/**
 * WeatherThemeToggle - Main toggle switch for enabling/disabling weather-based themes.
 * Provides a clear, accessible toggle with status indication.
 */

import React from 'react';
import { useWeatherTheme } from '@/context/WeatherThemeContext';

export function WeatherThemeToggle() {
  const { preferences, toggleEnabled, theme, status } = useWeatherTheme();

  return (
    <div className="weather-toggle" role="region" aria-label="Weather theme toggle">
      <div className="weather-toggle__header">
        <div className="weather-toggle__info">
          <h3 className="weather-toggle__title">Weather-Based Theme</h3>
          <p className="weather-toggle__description">
            Automatically apply color themes to tasks based on your local weather conditions.
          </p>
        </div>
        <label className="weather-toggle__switch" htmlFor="weather-theme-toggle">
          <input
            id="weather-theme-toggle"
            type="checkbox"
            role="switch"
            checked={preferences.enabled}
            onChange={toggleEnabled}
            aria-checked={preferences.enabled}
            aria-label={`Weather-based theme is ${preferences.enabled ? 'enabled' : 'disabled'}`}
          />
          <span className="weather-toggle__slider" aria-hidden="true" />
          <span className="weather-toggle__state-label">
            {preferences.enabled ? 'On' : 'Off'}
          </span>
        </label>
      </div>

      {preferences.enabled && theme && (
        <div className="weather-toggle__status" aria-live="polite">
          <span className="weather-toggle__icon" aria-hidden="true">{theme.icon}</span>
          <span className="weather-toggle__condition">
            {theme.label}
          </span>
          {status === 'loading' && (
            <span className="weather-toggle__loading" aria-label="Loading weather data">
              Updating…
            </span>
          )}
        </div>
      )}

      {preferences.enabled && status === 'error' && (
        <div className="weather-toggle__error" role="alert">
          <span aria-hidden="true">⚠️</span>
          <span>Weather data unavailable. Using default theme.</span>
        </div>
      )}
    </div>
  );
}
