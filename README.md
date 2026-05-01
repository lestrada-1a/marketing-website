# marketing-website

## Weather-Based Theme Toggle

A modular system for applying weather-based color themes to task views. When enabled, the system detects the user's location, fetches current weather conditions, and applies a corresponding accessible color theme to task cards.

### Features

- **User-facing toggle** — Default state is off for all users; can be enabled per-user
- **Geolocation with manual fallback** — Uses browser Geolocation API; falls back to manual city entry when permission is denied
- **Accessible color palettes** — All themes are WCAG 2.1 AA compliant with 4.5:1+ contrast ratios and are color-blind safe
- **Non-color cues** — Every weather state includes an icon and text label so color is never the sole indicator
- **Weather data caching** — 20-minute TTL with rate limiting to minimize API calls
- **Per-project/board overrides** — Teams can enable or disable the theme independently per project or board
- **Graceful degradation** — Falls back to standard theme when API is unavailable, with optional status message
- **Privacy-safe** — Coordinates coarsened to ~1km, no persistent precise location storage

### Weather Condition → Theme Mapping

| Condition     | Icon | Colors                     | Description                    |
|---------------|------|----------------------------|--------------------------------|
| Clear         | ☀️   | Warm yellows/golds         | Sunny, clear skies             |
| Cloudy        | ☁️   | Soft grays/slate           | Overcast conditions            |
| Rainy         | 🌧️   | Cool blues                 | Rain or drizzle                |
| Stormy        | ⛈️   | Deep purples               | Thunderstorms                  |
| Snowy         | ❄️   | Ice blues/whites           | Snow conditions                |
| Extreme Heat  | 🔥   | Warm oranges/reds          | Temperature ≥ 40°C            |
| Extreme Cold  | 🥶   | Deep teals/ice             | Temperature ≤ -15°C           |
| Unknown       | 🌡️   | Neutral grays              | Fallback when data unavailable |

### Quick Start

```typescript
import { WeatherThemeController } from './src/weather-theme';

// Initialize the controller
const controller = new WeatherThemeController({
  apiKey: 'YOUR_OPENWEATHERMAP_API_KEY',
});

await controller.initialize();

// Enable the theme
await controller.setEnabled(true);

// Check current theme
const theme = controller.getCurrentTheme();
console.log(`Current weather: ${theme?.icon} ${theme?.label}`);
```

### UI Component

```typescript
import { createWeatherThemeToggle } from './src/weather-theme';

const container = document.getElementById('settings-panel');
const cleanup = createWeatherThemeToggle(container, { controller });

// Later, to unmount:
cleanup();
```

### Per-Project/Board Overrides

```typescript
// Disable for a specific project
controller.setProjectOverride('PROJ-1', false);

// Enable for a specific board even if globally off
controller.setBoardOverride('board-42', true);

// Check if enabled in a specific context
controller.isEnabledForContext({ projectId: 'PROJ-1' }); // false
controller.isEnabledForContext({ boardId: 'board-42' }); // true

// Remove an override (reverts to global setting)
controller.setProjectOverride('PROJ-1', undefined);
```

### Manual Location

```typescript
// Set a manual location when geolocation is unavailable
await controller.setManualLocation('London', 'UK');

// Clear manual location
await controller.setManualLocation('');
```

### Event Handling

```typescript
import { WeatherThemeEvent } from './src/weather-theme';

controller.on(WeatherThemeEvent.ThemeChanged, ({ theme }) => {
  console.log('Theme changed:', theme?.label);
});

controller.on(WeatherThemeEvent.FallbackActivated, ({ reason }) => {
  console.log('Fallback activated:', reason);
});

controller.on(WeatherThemeEvent.Error, ({ error, context }) => {
  console.error(`Error in ${context}:`, error.message);
});
```

### CSS Integration

The theme applies CSS custom properties that can be used in your task card styles:

```css
.task-card {
  background-color: var(--wt-task-bg);
  border-color: var(--wt-border);
  color: var(--wt-text-primary);
}

.task-card .meta {
  color: var(--wt-text-secondary);
}

.task-badge {
  background-color: var(--wt-badge-bg);
  color: var(--wt-badge-text);
}
```

### Architecture

```
src/weather-theme/
├── index.ts                  # Barrel exports
├── types.ts                  # Type definitions and enums
├── themes.ts                 # Weather → theme color mapping
├── location-service.ts       # Geolocation + manual fallback
├── weather-api.ts            # Weather API client (OpenWeatherMap)
├── weather-cache.ts          # In-memory + localStorage caching
├── preferences.ts            # User preferences persistence
├── event-emitter.ts          # Typed event system
├── theme-controller.ts       # Main orchestrator
├── ui/
│   ├── weather-theme-toggle.ts   # Toggle UI component
│   └── weather-theme-styles.css  # Component styles
└── __tests__/                # Test suite (76 tests)
```

### Privacy Policy

**What is stored:**
- **Preferences** — Toggle state, manual location (city name only), per-project/board overrides in `localStorage`
- **Weather cache** — Weather condition, temperature, and description (no location data) in `localStorage` with 20-minute TTL
- **Coordinates** — Coarsened to ~1km precision (2 decimal places), used only transiently for API calls, never persisted

**What is NOT stored:**
- Precise GPS coordinates
- Location history
- Any user-identifiable data in weather API requests

**Third-party data sharing:**
- Location data (coarsened coordinates or city name) is sent only to the configured weather API provider (OpenWeatherMap by default)
- No other third parties receive location or weather data

### Running Tests

```bash
npm install
npm test
```
