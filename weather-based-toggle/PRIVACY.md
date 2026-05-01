# Weather-Based Theme Toggle — Privacy & Data Documentation

## What Data Is Collected

| Data | Purpose | Storage Location | Retention |
|------|---------|-----------------|-----------|
| City-level coordinates (lat/lon) | Fetch weather from Open-Meteo API | Browser `localStorage` | Until user clears data or disables feature |
| Location name (city, country) | Display in UI | Browser `localStorage` | Until user clears data or disables feature |
| Weather conditions (temp, code, wind) | Determine color theme | Browser `localStorage` (cache) | 30 minutes (auto-expires) |
| Toggle preferences (on/off, per-project) | Remember user settings | Browser `localStorage` | Until user clears data |

## What Data Is NOT Collected

- **No precise GPS coordinates** are stored — coordinates are rounded to 2 decimal places (~1.1 km precision) before any use.
- **No server-side storage** — all data stays in the user's browser.
- **No analytics or tracking** related to location or weather data.
- **No user identification** is sent to the weather API.
- **No cookies** are used for this feature.

## Third-Party Services

| Service | Purpose | Data Sent | Privacy Policy |
|---------|---------|-----------|----------------|
| [Open-Meteo](https://open-meteo.com) | Weather data & geocoding | Rounded lat/lon coordinates, city name (for geocoding) | [open-meteo.com/en/terms](https://open-meteo.com/en/terms) |

- Open-Meteo is a **free, open-source** weather API that does not require API keys or user accounts.
- Only **city-level coordinates** are sent — never precise GPS data.
- No other third-party services receive location or weather data.

## Location Permissions

- The feature uses the browser's **Geolocation API** (with user consent) as the primary method.
- If the user **denies permission** or geolocation is unavailable, they can manually enter a city name.
- Manual city names are geocoded via Open-Meteo's geocoding endpoint.
- The browser's location permission can be revoked at any time through browser settings.

## User Controls

Users have full control over their data:

1. **Toggle off** — Disables the feature entirely; no weather data is fetched.
2. **Clear All Weather Data** — Button in settings that removes all stored location, weather, and preference data.
3. **Per-project overrides** — Users can disable the feature for specific projects/boards.
4. **Manual location** — Users can choose what location to use instead of granting GPS access.

## Data Flow

```
User grants location OR enters city name
        ↓
Coordinates rounded to ~1km precision
        ↓
Stored in browser localStorage
        ↓
Sent to Open-Meteo API (HTTPS)
        ↓
Weather response cached locally (30 min TTL)
        ↓
Weather condition → color theme applied in browser
```

## Update Frequency

- Weather data is refreshed **at most every 15 minutes** (minimum interval between API calls).
- Cache expires after **30 minutes**.
- Periodic background updates occur every **30 minutes** while the feature is active.
- No requests are made when the feature is toggled off.

## Compliance Notes

- All data processing occurs **client-side** in the user's browser.
- No personal data is transmitted to or stored on the application's servers.
- The feature follows **data minimization** principles — only city-level location is used.
- Users must **opt in** (default state is off) and can opt out at any time.
