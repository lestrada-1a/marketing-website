'use client';

/**
 * ProjectOverrides - Per-project/board override controls.
 * Allows teams to independently enable or disable weather themes for specific projects.
 */

import React, { useState } from 'react';
import { useWeatherTheme } from '@/context/WeatherThemeContext';

/** Demo project list - in a real app these would come from the project service */
const DEMO_PROJECTS = [
  { id: 'proj-1', name: 'Marketing Campaign', board: 'Sprint Board' },
  { id: 'proj-2', name: 'Product Launch', board: 'Kanban Board' },
  { id: 'proj-3', name: 'Design System', board: 'Design Board' },
  { id: 'proj-4', name: 'Q2 Planning', board: 'Planning Board' },
];

export function ProjectOverrides() {
  const {
    preferences,
    setProjectOverride,
    removeProjectOverride,
    isActiveForProject,
  } = useWeatherTheme();

  const [expanded, setExpanded] = useState(false);

  if (!preferences.enabled) return null;

  return (
    <div className="project-overrides" role="region" aria-label="Project-specific overrides">
      <button
        className="project-overrides__header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls="project-overrides-list"
      >
        <h4 className="project-overrides__title">
          <span aria-hidden="true">⚙️</span> Project & Board Overrides
        </h4>
        <span className="project-overrides__chevron" aria-hidden="true">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      <p className="project-overrides__description">
        Override the global weather theme setting for specific projects or boards.
      </p>

      {expanded && (
        <div id="project-overrides-list" className="project-overrides__list">
          {DEMO_PROJECTS.map((project) => {
            const isActive = isActiveForProject(project.id);
            const hasOverride = project.id in preferences.projectOverrides;

            return (
              <div key={project.id} className="project-overrides__item">
                <div className="project-overrides__project-info">
                  <span className="project-overrides__project-name">{project.name}</span>
                  <span className="project-overrides__board-name">{project.board}</span>
                </div>
                <div className="project-overrides__controls">
                  <select
                    value={hasOverride ? (isActive ? 'enabled' : 'disabled') : 'global'}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'global') {
                        removeProjectOverride(project.id);
                      } else {
                        setProjectOverride(project.id, value === 'enabled');
                      }
                    }}
                    aria-label={`Weather theme setting for ${project.name}`}
                    className="project-overrides__select"
                  >
                    <option value="global">
                      Use Global ({preferences.enabled ? 'On' : 'Off'})
                    </option>
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                  <span
                    className={`project-overrides__status ${isActive ? 'project-overrides__status--active' : ''}`}
                    aria-label={`Theme is ${isActive ? 'active' : 'inactive'} for this project`}
                  >
                    {isActive ? '● Active' : '○ Inactive'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
