'use client';

/**
 * TaskView - Demo task list that shows weather-themed task cards.
 * Demonstrates how the weather theme applies to actual task rendering.
 */

import React from 'react';
import { useWeatherTheme } from '@/context/WeatherThemeContext';
import { WEATHER_THEME_MAP } from '@/lib/weather-themes';

/** Sample tasks for demonstration */
const SAMPLE_TASKS = [
  { id: '1', title: 'Update landing page copy', status: 'In Progress', priority: 'High', assignee: 'Alice', project: 'proj-1' },
  { id: '2', title: 'Design new email template', status: 'To Do', priority: 'Medium', assignee: 'Bob', project: 'proj-1' },
  { id: '3', title: 'Review analytics dashboard', status: 'In Review', priority: 'Low', assignee: 'Carol', project: 'proj-2' },
  { id: '4', title: 'Prepare Q2 report', status: 'To Do', priority: 'High', assignee: 'David', project: 'proj-2' },
  { id: '5', title: 'Fix mobile navigation bug', status: 'In Progress', priority: 'Critical', assignee: 'Eve', project: 'proj-3' },
  { id: '6', title: 'Optimize image loading', status: 'Done', priority: 'Medium', assignee: 'Frank', project: 'proj-3' },
];

const PRIORITY_ICONS: Record<string, string> = {
  Critical: '🔴',
  High: '🟠',
  Medium: '🟡',
  Low: '🟢',
};

export function TaskView() {
  const { theme, weather, preferences, isActiveForProject, status, errorMessage } = useWeatherTheme();

  // Use default/fallback theme when weather theme is not active
  const defaultTheme = WEATHER_THEME_MAP.unknown;
  const activeTheme = preferences.enabled && theme ? theme : defaultTheme;

  const viewStyle = preferences.enabled && theme
    ? { backgroundColor: theme.colors.viewBackground }
    : {};

  return (
    <div className="task-view" style={viewStyle} role="region" aria-label="Task list">
      <div className="task-view__header">
        <h3 className="task-view__title">Tasks</h3>
        {preferences.enabled && weather && theme && (
          <div className="task-view__weather-badge" aria-live="polite">
            <span aria-hidden="true">{theme.icon}</span>
            <span>{theme.label}</span>
            <span className="task-view__temp">{Math.round(weather.temperature)}°C</span>
          </div>
        )}
        {preferences.enabled && status === 'error' && (
          <div className="task-view__error-badge" role="status">
            <span aria-hidden="true">⚠️</span>
            <span>{errorMessage ?? 'Weather unavailable'}</span>
          </div>
        )}
      </div>

      <div className="task-view__list">
        {SAMPLE_TASKS.map((task) => {
          const taskThemeActive = preferences.enabled && isActiveForProject(task.project);
          const cardTheme = taskThemeActive && theme ? theme : defaultTheme;

          return (
            <div
              key={task.id}
              className="task-card"
              style={{
                backgroundColor: cardTheme.colors.cardBackground,
                borderLeft: `4px solid ${cardTheme.colors.accent}`,
              }}
              role="article"
              aria-label={`Task: ${task.title}`}
            >
              <div className="task-card__content">
                <div className="task-card__top-row">
                  <span
                    className="task-card__title"
                    style={{ color: cardTheme.colors.textPrimary }}
                  >
                    {task.title}
                  </span>
                  {taskThemeActive && theme && (
                    <span
                      className="task-card__weather-indicator"
                      style={{
                        backgroundColor: cardTheme.colors.badgeBackground,
                        color: cardTheme.colors.badgeText,
                      }}
                      aria-label={cardTheme.ariaLabel}
                    >
                      <span aria-hidden="true">{cardTheme.icon}</span>
                      <span className="task-card__weather-label">{cardTheme.label}</span>
                    </span>
                  )}
                </div>
                <div className="task-card__meta" style={{ color: cardTheme.colors.textSecondary }}>
                  <span className="task-card__status">{task.status}</span>
                  <span className="task-card__priority">
                    <span aria-hidden="true">{PRIORITY_ICONS[task.priority] ?? '⚪'}</span>
                    {task.priority}
                  </span>
                  <span className="task-card__assignee">
                    <span aria-hidden="true">👤</span>
                    {task.assignee}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
