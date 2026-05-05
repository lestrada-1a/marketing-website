# Privacy & Data Handling

## What Data Is Collected

| Data | Purpose | Precision | Storage |
|---|---|---|---|
| Location (coordinates) | Fetch local weather | Coarsened to ~11 km | Browser localStorage only |
| City name (if manually entered) | Geocode to coordinates | As entered | Browser localStorage only |
| Weather data | Apply color theme | Current conditions only | Browser localStorage (30-min TTL) |
| Feature preferences | Remember toggle state | On/off, overrides | Browser localStorage only |

## How Data Is Used

1. **Location** is used solely to request weather data from the Open-Meteo API
2. **Coordinates are coarsened** (rounded to 1 decimal place, ~11 km) before any API call
3. **Weather data** is cached locally for up to 30 minutes to minimize API requests
4. **No precise location** is ever stored or transmitted

## What Is NOT Done

- ❌ No server-side storage of location or weather data
- ❌ No sharing of data with third parties (beyond the Open-Meteo weather request)
- ❌ No tracking, analytics, or profiling based on location
- ❌ No cookies — only localStorage
- ❌ No cross-device syncing of location data

## Data Retention

- **While enabled:** Preferences and cached weather data are stored in browser localStorage
- **When disabled:** All data (preferences, location, cached weather) is immediately deleted
- **Cache expiry:** Weather data automatically expires after 30 minutes

## Third-Party Services

| Service | Purpose | Privacy Policy |
|---|---|---|
| [Open-Meteo](https://open-meteo.com/) | Weather data & geocoding | Open-source, no API key, no tracking |
| Browser Geolocation API | Auto-detect location | Controlled by browser permissions |

## User Controls

- **Opt-in only:** Feature is disabled by default for all users
- **Location permission:** Browser will prompt before sharing location; denial is handled gracefully
- **Manual location:** Users can enter a city name instead of sharing precise location
- **Disable anytime:** Turning off the toggle immediately clears all stored data
- **Per-project control:** Teams can override the setting per project or board
