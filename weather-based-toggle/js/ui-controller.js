/**
 * UI Controller Module
 *
 * Manages all DOM interactions:
 *  - Toggle switch behavior
 *  - Settings panel open/close
 *  - Location detection and manual input
 *  - Weather status display
 *  - Project override checkboxes
 *  - Theme mapping preview grid
 *  - Status banners and error messages
 *  - Task board rendering (demo)
 */

const UIController = (() => {
  'use strict';

  // DOM element references
  let els = {};

  // Sample demo tasks for the task board
  const DEMO_TASKS = {
    'proj-alpha': [
      { id: 'ALPHA-101', title: 'Design landing page mockups', status: 'todo', priority: 'high' },
      { id: 'ALPHA-102', title: 'Implement responsive navigation', status: 'in-progress', priority: 'medium' },
      { id: 'ALPHA-103', title: 'Write API documentation', status: 'in-progress', priority: 'low' },
      { id: 'ALPHA-104', title: 'Set up CI/CD pipeline', status: 'done', priority: 'high' },
      { id: 'ALPHA-105', title: 'User acceptance testing', status: 'todo', priority: 'medium' },
    ],
    'proj-beta': [
      { id: 'BETA-201', title: 'Database schema migration', status: 'todo', priority: 'high' },
      { id: 'BETA-202', title: 'Integrate payment gateway', status: 'in-progress', priority: 'high' },
      { id: 'BETA-203', title: 'Performance benchmarking', status: 'done', priority: 'medium' },
      { id: 'BETA-204', title: 'Security audit review', status: 'todo', priority: 'high' },
    ],
    'proj-gamma': [
      { id: 'GAMMA-301', title: 'Mobile app wireframes', status: 'in-progress', priority: 'medium' },
      { id: 'GAMMA-302', title: 'Push notification service', status: 'todo', priority: 'low' },
      { id: 'GAMMA-303', title: 'Analytics dashboard', status: 'done', priority: 'medium' },
      { id: 'GAMMA-304', title: 'Localization support', status: 'todo', priority: 'low' },
      { id: 'GAMMA-305', title: 'Offline mode implementation', status: 'in-progress', priority: 'high' },
      { id: 'GAMMA-306', title: 'Beta release preparation', status: 'todo', priority: 'high' },
    ],
  };

  const PROJECTS = [
    { id: 'proj-alpha', name: 'Project Alpha' },
    { id: 'proj-beta', name: 'Project Beta' },
    { id: 'proj-gamma', name: 'Project Gamma' },
  ];

  /**
   * Initialize all DOM references.
   */
  function _cacheElements() {
    els = {
      weatherToggle: document.getElementById('weatherToggle'),
      globalWeatherToggle: document.getElementById('globalWeatherToggle'),
      settingsBtn: document.getElementById('settingsBtn'),
      settingsPanel: document.getElementById('settingsPanel'),
      settingsOverlay: document.getElementById('settingsOverlay'),
      closeSettingsBtn: document.getElementById('closeSettingsBtn'),
      detectLocationBtn: document.getElementById('detectLocationBtn'),
      locationStatus: document.getElementById('locationStatus'),
      manualLocationInput: document.getElementById('manualLocationInput'),
      setLocationBtn: document.getElementById('setLocationBtn'),
      weatherStatus: document.getElementById('weatherStatus'),
      weatherIcon: document.getElementById('weatherIcon'),
      weatherLabel: document.getElementById('weatherLabel'),
      weatherPreview: document.getElementById('weatherPreview'),
      themeMappingGrid: document.getElementById('themeMappingGrid'),
      projectOverrides: document.getElementById('projectOverrides'),
      clearDataBtn: document.getElementById('clearDataBtn'),
      statusBanner: document.getElementById('statusBanner'),
      statusMessage: document.getElementById('statusMessage'),
      statusClose: document.getElementById('statusClose'),
      taskBoard: document.getElementById('taskBoard'),
      projectFilter: document.getElementById('projectFilter'),
    };
  }

  /**
   * Bind all event listeners.
   */
  function _bindEvents(callbacks) {
    // Header toggle
    els.weatherToggle.addEventListener('change', (e) => {
      callbacks.onToggleChange(e.target.checked);
    });

    // Settings panel toggle in global settings
    els.globalWeatherToggle.addEventListener('change', (e) => {
      callbacks.onToggleChange(e.target.checked);
    });

    // Settings panel open/close
    els.settingsBtn.addEventListener('click', () => _openSettings());
    els.closeSettingsBtn.addEventListener('click', () => _closeSettings());
    els.settingsOverlay.addEventListener('click', () => _closeSettings());

    // Keyboard: close settings with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !els.settingsPanel.hidden) {
        _closeSettings();
      }
    });

    // Location detection
    els.detectLocationBtn.addEventListener('click', () => callbacks.onDetectLocation());

    // Manual location
    els.setLocationBtn.addEventListener('click', () => {
      callbacks.onSetManualLocation(els.manualLocationInput.value);
    });
    els.manualLocationInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        callbacks.onSetManualLocation(els.manualLocationInput.value);
      }
    });

    // Clear data
    els.clearDataBtn.addEventListener('click', () => callbacks.onClearData());

    // Status banner close
    els.statusClose.addEventListener('click', () => hideStatusBanner());

    // Project filter
    els.projectFilter.addEventListener('change', () => {
      renderTaskBoard(els.projectFilter.value);
      callbacks.onProjectFilterChange(els.projectFilter.value);
    });
  }

  /**
   * Open the settings panel.
   */
  function _openSettings() {
    els.settingsPanel.hidden = false;
    els.settingsOverlay.hidden = false;
    els.settingsBtn.setAttribute('aria-expanded', 'true');
    // Trap focus in panel
    els.closeSettingsBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the settings panel.
   */
  function _closeSettings() {
    els.settingsPanel.hidden = true;
    els.settingsOverlay.hidden = true;
    els.settingsBtn.setAttribute('aria-expanded', 'false');
    els.settingsBtn.focus();
    document.body.style.overflow = '';
  }

  /**
   * Sync toggle states from preferences.
   */
  function syncToggleState(enabled) {
    els.weatherToggle.checked = enabled;
    els.weatherToggle.setAttribute('aria-checked', String(enabled));
    els.globalWeatherToggle.checked = enabled;
    els.globalWeatherToggle.setAttribute('aria-checked', String(enabled));
  }

  /**
   * Update the weather status indicator in the header.
   */
  function updateWeatherStatus(condition, weatherData) {
    if (!condition || condition.id === 'default') {
      els.weatherStatus.hidden = true;
      return;
    }

    els.weatherIcon.textContent = condition.icon;
    let labelText = condition.label;
    if (weatherData && typeof weatherData.temperature === 'number') {
      labelText += ` · ${Math.round(weatherData.temperature)}°C`;
    }
    els.weatherLabel.textContent = labelText;
    els.weatherStatus.hidden = false;
  }

  /**
   * Update the weather preview in settings panel.
   */
  function updateWeatherPreview(condition, weatherData) {
    if (!weatherData) {
      els.weatherPreview.innerHTML =
        '<p class="no-data">No weather data available. Enable the toggle and set a location to see weather info.</p>';
      return;
    }

    const staleNote = weatherData.stale
      ? '<p class="stale-warning" role="alert">⚠️ Using cached data — weather service temporarily unavailable.</p>'
      : '';

    const description = WeatherService.describeWeatherCode(weatherData.weatherCode);
    const location = Preferences.getLocation();

    els.weatherPreview.innerHTML = `
      ${staleNote}
      <div class="weather-preview-card">
        <div class="weather-preview-icon" aria-hidden="true">${condition.icon}</div>
        <div class="weather-preview-details">
          <div class="weather-preview-condition">${condition.label} — ${description}</div>
          <div class="weather-preview-temp">${Math.round(weatherData.temperature)}°C</div>
          <div class="weather-preview-wind">Wind: ${weatherData.windSpeed} km/h</div>
          ${location ? `<div class="weather-preview-location">📍 ${_escapeHtml(location.name)}</div>` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Update location status message.
   */
  function updateLocationStatus(message, type = 'info') {
    els.locationStatus.textContent = message;
    els.locationStatus.className = `location-status location-status-${type}`;
  }

  /**
   * Show the status banner.
   */
  function showStatusBanner(message, type = 'info') {
    els.statusMessage.textContent = message;
    els.statusBanner.className = `status-banner status-banner-${type}`;
    els.statusBanner.hidden = false;

    // Auto-hide after 8 seconds for non-error messages
    if (type !== 'error') {
      setTimeout(() => hideStatusBanner(), 8000);
    }
  }

  /**
   * Hide the status banner.
   */
  function hideStatusBanner() {
    els.statusBanner.hidden = true;
  }

  /**
   * Render the theme mapping grid in settings.
   */
  function renderThemeMappingGrid() {
    const conditions = WeatherConditions.getAllConditions();
    let html = '';

    for (const [key, cond] of Object.entries(conditions)) {
      if (key === 'default') continue;
      html += `
        <div class="theme-mapping-item" style="border-left: 4px solid ${cond.colors.primary}">
          <span class="theme-mapping-icon" aria-hidden="true">${cond.icon}</span>
          <div class="theme-mapping-info">
            <strong>${cond.label}</strong>
            <span class="theme-mapping-desc">${cond.description}</span>
          </div>
          <div class="theme-mapping-swatch" 
               style="background: ${cond.colors.cardBg}; border: 2px solid ${cond.colors.cardBorder}"
               aria-label="${cond.label} theme colors">
            <span style="color: ${cond.colors.textPrimary}">Aa</span>
          </div>
        </div>
      `;
    }

    els.themeMappingGrid.innerHTML = html;
  }

  /**
   * Render per-project override toggles.
   */
  function renderProjectOverrides(onOverrideChange) {
    const overrides = Preferences.getProjectOverrides();
    const globalEnabled = Preferences.isEnabled();

    let html = '';
    for (const project of PROJECTS) {
      const hasOverride = overrides.hasOwnProperty(project.id);
      const isEnabled = hasOverride ? overrides[project.id] : globalEnabled;
      const overrideLabel = hasOverride ? '(override set)' : '(using global)';

      html += `
        <div class="project-override-item">
          <label class="toggle-switch toggle-switch-small" for="override-${project.id}">
            <span class="toggle-label">${_escapeHtml(project.name)} <span class="override-hint">${overrideLabel}</span></span>
            <input
              type="checkbox"
              id="override-${project.id}"
              data-project-id="${project.id}"
              ${isEnabled ? 'checked' : ''}
              role="switch"
              aria-checked="${isEnabled}"
            />
            <span class="toggle-slider" aria-hidden="true"></span>
          </label>
          ${hasOverride ? `<button class="btn btn-text btn-reset-override" data-project-id="${project.id}" aria-label="Reset ${project.name} to global setting">Reset</button>` : ''}
        </div>
      `;
    }

    els.projectOverrides.innerHTML = html;

    // Bind override toggle events
    els.projectOverrides.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const projectId = e.target.dataset.projectId;
        onOverrideChange(projectId, e.target.checked);
      });
    });

    // Bind reset buttons
    els.projectOverrides.querySelectorAll('.btn-reset-override').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const projectId = e.target.dataset.projectId;
        onOverrideChange(projectId, null); // null = remove override
      });
    });
  }

  /**
   * Render the task board with demo tasks.
   */
  function renderTaskBoard(projectFilter = 'all') {
    const columns = {
      todo: { label: 'To Do', tasks: [] },
      'in-progress': { label: 'In Progress', tasks: [] },
      done: { label: 'Done', tasks: [] },
    };

    // Gather tasks based on filter
    const projectIds = projectFilter === 'all' ? Object.keys(DEMO_TASKS) : [projectFilter];

    for (const projectId of projectIds) {
      const tasks = DEMO_TASKS[projectId] || [];
      for (const task of tasks) {
        if (columns[task.status]) {
          columns[task.status].tasks.push({ ...task, projectId });
        }
      }
    }

    let html = '';
    for (const [statusKey, column] of Object.entries(columns)) {
      html += `
        <div class="task-column" data-status="${statusKey}">
          <div class="task-column-header">
            <h3>${column.label}</h3>
            <span class="task-count">${column.tasks.length}</span>
          </div>
          <div class="task-column-body">
      `;

      for (const task of column.tasks) {
        const priorityClass = `priority-${task.priority}`;
        const isWeatherEnabled = Preferences.isEnabledForProject(task.projectId);
        const weatherClass = isWeatherEnabled ? 'weather-themed' : '';

        html += `
          <div class="task-card ${priorityClass} ${weatherClass}" data-project="${task.projectId}">
            <div class="task-card-header">
              <span class="task-id">${task.id}</span>
              <span class="task-priority-badge" aria-label="Priority: ${task.priority}">${task.priority}</span>
            </div>
            <div class="task-card-body">
              <p class="task-title">${_escapeHtml(task.title)}</p>
            </div>
            <div class="task-card-footer">
              <span class="task-project-label">${_escapeHtml(_getProjectName(task.projectId))}</span>
            </div>
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;
    }

    els.taskBoard.innerHTML = html;
  }

  /**
   * Get project display name.
   */
  function _getProjectName(projectId) {
    const project = PROJECTS.find((p) => p.id === projectId);
    return project ? project.name : projectId;
  }

  /**
   * Escape HTML to prevent XSS.
   */
  function _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Set the location input to the disabled/loading state.
   */
  function setLocationLoading(loading) {
    els.detectLocationBtn.disabled = loading;
    els.setLocationBtn.disabled = loading;
    els.manualLocationInput.disabled = loading;
    if (loading) {
      els.detectLocationBtn.textContent = '⏳ Detecting...';
    } else {
      els.detectLocationBtn.textContent = '📍 Detect My Location';
    }
  }

  /**
   * Initialize the UI.
   */
  function init(callbacks) {
    _cacheElements();
    _bindEvents(callbacks);
    renderThemeMappingGrid();
  }

  return {
    init,
    syncToggleState,
    updateWeatherStatus,
    updateWeatherPreview,
    updateLocationStatus,
    showStatusBanner,
    hideStatusBanner,
    renderProjectOverrides,
    renderTaskBoard,
    setLocationLoading,
  };
})();
