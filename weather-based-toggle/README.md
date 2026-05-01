# Weather-Based Theme Toggle

A user-facing feature that dynamically applies color themes to the task view based on local weather conditions.

## Features

- **Toggle control** — Enable/disable weather-based themes (default: off)
- **Location detection** — Auto-detect via browser Geolocation API or manual city entry
- **Weather-to-theme mapping** — Clear, cloudy, rainy, stormy, snowy, extreme heat/cold, foggy, windy
- **Accessible design** — High-contrast color-blind-safe palettes with emoji icons and text labels as non-color cues
- **Per-project overrides** — Disable weather themes on specific projects/boards independently
- **Caching** — Weather data cached for 30 min, max ~2 API calls/hour per location
- **Privacy-safe** — No server storage, rounded coordinates, see [PRIVACY.md](./PRIVACY.md)
- **Graceful degradation** — Falls back to default theme on API errors with subtle status messages

## File Structure

```
weather-based-toggle/
├── index.html                  # Main page (served at /weather-based-toggle)
├── README.md                   # This file
├── PRIVACY.md                  # Privacy & data documentation
├── css/
│   ├── styles.css              # Core layout & component styles
│   ├── themes.css              # Per-weather-condition theme decorations
│   └── accessibility.css       # WCAG AA compliance, reduced motion, high contrast
└── js/
    ├── weather-conditions.js   # Weather classification & theme color definitions
    ├── preferences.js          # User preferences (localStorage)
    ├── weather-service.js      # Open-Meteo API integration, caching, geolocation
    ├── theme-manager.js        # CSS custom property application & transitions
    ├── ui-controller.js        # DOM interactions & event handling
    └── app.js                  # Entry point & orchestration
```

## Weather Condition → Theme Mapping

| Condition | Icon | Theme Colors | WMO Codes |
|-----------|------|-------------|-----------|
| Clear | ☀️ | Warm amber/gold | 0–1 |
| Cloudy | ☁️ | Soft neutral grey | 2–3 |
| Foggy | 🌫️ | Muted stone | 45–48 |
| Rainy | 🌧️ | Cool blue | 51–67, 80–82 |
| Snowy | ❄️ | Crisp cyan | 71–77, 85–86 |
| Stormy | ⛈️ | Deep purple | 95–99 |
| Extreme Heat | 🔥 | Bold red (>35°C) | Temperature-based |
| Extreme Cold | 🥶 | Deep blue-grey (<-10°C) | Temperature-based |
| Windy | 💨 | Airy teal (>50 km/h) | Wind-based |

## Technology

- **Pure HTML/CSS/JavaScript** — No build tools or frameworks required
- **Open-Meteo API** — Free, open-source, no API key needed
- **localStorage** — Client-side preference and cache storage

## Usage

Serve the `weather-based-toggle/` directory from your web server at the `/weather-based-toggle` path. The page is fully self-contained.
