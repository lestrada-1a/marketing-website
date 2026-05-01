'use client';

/**
 * WeatherThemePreview - Shows a preview of all weather themes
 * and highlights the currently active one.
 */

import React from 'react';
import { useWeatherTheme } from '@/context/WeatherThemeContext';
import { getAllThemes } from '@/lib/weather-themes';
import { WeatherTheme } from '@/types/weather';

function ThemeCard({ theme, isActive }: { theme: WeatherTheme; isActive: boolean }) {
  return (
    <div
      className={`theme-preview__card ${isActive ? 'theme-preview__card--active' : ''}`}
      style={{
        backgroundColor: theme.colors.cardBackground,
        borderColor: theme.colors.accent,
      }}
      role="listitem"
      aria-label={theme.ariaLabel}
      aria-current={isActive ? 'true' : undefined}
    >
      <div className="theme-preview__card-header">
        <span className="theme-preview__icon" aria-hidden="true">
          {theme.icon}
        </span>
        <span
          className="theme-preview__label"
          style={{ color: theme.colors.textPrimary }}
        >
          {theme.label}
        </span>
        {isActive && (
          <span className="theme-preview__active-badge" style={{
            backgroundColor: theme.colors.badgeBackground,
            color: theme.colors.badgeText,
          }}>
            Active
          </span>
        )}
      </div>
      <div className="theme-preview__colors">
        <div
          className="theme-preview__swatch"
          style={{ backgroundColor: theme.colors.cardBackground }}
          title={`Card: ${theme.colors.cardBackground}`}
          aria-label={`Card background color: ${theme.colors.cardBackground}`}
        />
        <div
          className="theme-preview__swatch"
          style={{ backgroundColor: theme.colors.accent }}
          title={`Accent: ${theme.colors.accent}`}
          aria-label={`Accent color: ${theme.colors.accent}`}
        />
        <div
          className="theme-preview__swatch"
          style={{ backgroundColor: theme.colors.badgeBackground }}
          title={`Badge: ${theme.colors.badgeBackground}`}
          aria-label={`Badge color: ${theme.colors.badgeBackground}`}
        />
      </div>
      {/* Sample task card preview */}
      <div
        className="theme-preview__sample-task"
        style={{
          backgroundColor: theme.colors.cardBackgroundAlt,
          borderLeft: `3px solid ${theme.colors.accent}`,
        }}
      >
        <span style={{ color: theme.colors.textPrimary, fontWeight: 600, fontSize: '0.85rem' }}>
          Sample Task
        </span>
        <span style={{ color: theme.colors.textSecondary, fontSize: '0.75rem' }}>
          {theme.label} theme applied
        </span>
        <span
          className="theme-preview__sample-badge"
          style={{
            backgroundColor: theme.colors.badgeBackground,
            color: theme.colors.badgeText,
          }}
        >
          {theme.icon} {theme.label}
        </span>
      </div>
    </div>
  );
}

export function WeatherThemePreview() {
  const { weather, preferences } = useWeatherTheme();
  const allThemes = getAllThemes();

  if (!preferences.enabled) return null;

  return (
    <div className="theme-preview" role="region" aria-label="Weather theme preview">
      <h4 className="theme-preview__title">Theme Gallery</h4>
      <p className="theme-preview__subtitle">
        Each weather condition maps to a unique, accessible color palette.
        The active theme is highlighted below.
      </p>
      <div className="theme-preview__grid" role="list">
        {allThemes.map((theme) => (
          <ThemeCard
            key={theme.condition}
            theme={theme}
            isActive={weather?.condition === theme.condition}
          />
        ))}
      </div>
    </div>
  );
}
