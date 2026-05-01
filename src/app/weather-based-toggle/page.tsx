'use client';

/**
 * /weather-based-toggle page
 *
 * Main page for the weather-based theme toggle feature.
 * Provides controls to enable/disable weather themes, configure location,
 * set per-project overrides, and preview all available themes.
 */

import React from 'react';
import { WeatherThemeProvider } from '@/context/WeatherThemeContext';
import { WeatherThemeToggle } from '@/components/WeatherThemeToggle';
import { LocationSettings } from '@/components/LocationSettings';
import { ProjectOverrides } from '@/components/ProjectOverrides';
import { WeatherThemePreview } from '@/components/WeatherThemePreview';
import { TaskView } from '@/components/TaskView';
import { PrivacyInfo } from '@/components/PrivacyInfo';

export default function WeatherBasedTogglePage() {
  return (
    <WeatherThemeProvider>
      <div className="weather-page">
        <header className="weather-page__header">
          <div className="weather-page__header-content">
            <h1 className="weather-page__title">Weather-Based Theme Toggle</h1>
            <p className="weather-page__subtitle">
              Bring your local weather into your workspace. Enable weather-based themes
              to automatically style tasks with colors inspired by current conditions.
            </p>
          </div>
        </header>

        <main className="weather-page__main">
          {/* Settings Panel */}
          <section className="weather-page__settings" aria-label="Theme settings">
            <div className="weather-page__card">
              <WeatherThemeToggle />
              <LocationSettings />
            </div>

            <div className="weather-page__card">
              <ProjectOverrides />
            </div>

            <div className="weather-page__card">
              <PrivacyInfo />
            </div>
          </section>

          {/* Task View Demo */}
          <section className="weather-page__content" aria-label="Task view with weather theme">
            <TaskView />
          </section>

          {/* Theme Preview Gallery */}
          <section className="weather-page__gallery" aria-label="Theme gallery">
            <WeatherThemePreview />
          </section>
        </main>

        <footer className="weather-page__footer">
          <p>
            Weather data provided by{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">
              Open-Meteo
            </a>
            . All color palettes are WCAG AA compliant and color-blind safe.
          </p>
        </footer>
      </div>
    </WeatherThemeProvider>
  );
}
