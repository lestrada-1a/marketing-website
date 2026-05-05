# Weather-Based Theme Toggle

A user-facing weather-based color theme for task views. Personalizes task styling based on local weather conditions while maintaining full accessibility.

## Features

- **Toggle (default: off)** — Opt-in weather themes via a header toggle switch
- **Location-aware** — Browser Geolocation API with manual city name fallback
- **9 weather themes** — Clear, Cloudy, Foggy, Rainy, Snowy, Stormy, Extreme Heat, Extreme Cold, Windy (+ Unknown fallback)
- **Accessible by design** — High-contrast, color-blind-safe palettes with non-color cues (icons + text labels)
- **Cached & efficient** — 30-min cache TTL, 15-min minimum fetch interval, request deduplication
- **Privacy-safe** — Coordinates coarsened to ~11 km, no server storage, data cleared on disable
- **Per-project overrides** — Teams can independently enable/disable per project or board
- **Graceful degradation** — Falls back to default theme when weather API is unavailable

## Accessibility (WCAG AA)

This feature was designed with accessibility as a core requirement:

| WCAG Criterion | Implementation |
|---|---|
| 1.4.1 Use of Color | Weather state communicated via icon + text label, never color alone |
| 1.4.3 Contrast (Minimum) | All text meets 4.5:1 minimum contrast ratio |
| 1.4.11 Non-text Contrast | UI components meet 3:1 contrast against background |
| 2.1.1 Keyboard | All controls operable via keyboard (Tab, Enter, Space) |
| 2.4.7 Focus Visible | 3px high-contrast focus rings on all interactive elements |
| 2.3.3 Reduced Motion | Animations disabled when `prefers-reduced-motion` is set |
| 2.5.8 Target Size | All interactive elements ≥ 44×44 CSS pixels |
| Forced Colors | Full support for Windows High Contrast / `forced-colors` mode |
| Color-blind safe | Themes distinguishable under protanopia, deuteranopia, tritanopia |

### Non-Color Cues

Weather state is **never** communicated by color alone. Every themed element includes:

1. **Icon** (emoji) — visual symbol for the weather condition
2. **Text label** — human-readable name (e.g., "Rainy", "Stormy")
3. **Badge** — combined icon + label badge on task cards and weather display
4. **ARIA labels** — screen-reader-friendly descriptions

## File Structure

```
weather-based-toggle/
├── index.html                  # Main page
├── README.md                   # This file
├── PRIVACY.md                  # Privacy & data handling documentation
├── css/
│   ├── styles.css              # Core layout & component styles
│   ├── themes.css              # Per-weather theme decorations
│   └── accessibility.css       # WCAG AA, reduced motion, high contrast, forced colors
└── js/
    ├── weather-conditions.js   # Weather classification & color-blind-safe theme definitions
    ├── preferences.js          # localStorage user preferences
    ├── weather-service.js      # Open-Meteo API client, caching, geolocation
    ├── theme-manager.js        # CSS custom property management
    ├── ui-controller.js        # DOM interactions & event handling
    └── app.js                  # Entry point & orchestration
```

## Weather → Theme Mapping

| Condition | Icon | Accent Color | Description |
|---|---|---|---|
| Clear | ☀️ | Dark Gold (#7A5A00) | Warm ivory tones |
| Cloudy | ☁️ | Slate (#5A6578) | Cool grey tones |
| Foggy | 🌫️ | Taupe (#7A7268) | Warm off-white tones |
| Rainy | 🌧️ | Blue (#2B6CB0) | Cool blue tones |
| Snowy | ❄️ | Steel Blue (#4878A8) | Ice-blue tones |
| Stormy | ⛈️ | Purple (#6B4C9A) | Muted purple-grey |
| Extreme Heat | 🔥 | Burnt Orange (#C44B00) | Warm peach tones |
| Extreme Cold | 🥶 | Teal (#1B7A8A) | Pale cyan tones |
| Windy | 💨 | Forest Green (#3A7D5C) | Mint-green tones |
| Unknown | 🌡️ | Grey (#555555) | Neutral fallback |

## Color-Blind Safety

Each theme is designed to be distinguishable not just by hue but by **lightness and saturation**:

- **Protanopia** (red-blind): No red/green-only distinctions; themes vary in blue–yellow axis and lightness
- **Deuteranopia** (green-blind): Same as above; accent colors span purple, blue, teal, gold
- **Tritanopia** (blue-blind): Themes include warm (gold, orange, taupe) and cool (grey, slate) options with distinct lightness

## API

Uses [Open-Meteo](https://open-meteo.com/) — free, open-source weather API:
- No API key required
- No user tracking
- WMO weather code classification
- Geocoding for city name → coordinates

## Privacy

See [PRIVACY.md](PRIVACY.md) for full details. Summary:
- Location coarsened to ~11 km before any API call
- All data stored in browser localStorage only
- Data cleared when feature is disabled
- No server-side storage of any user data
