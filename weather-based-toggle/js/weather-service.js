/**
 * Weather Service Module
 *
 * Fetches weather data from Open-Meteo (free, no API key, privacy-friendly).
 * Implements:
 *  - Caching with configurable TTL (default: 30 minutes)
 *  - Bounded update frequency (max ~2 requests/hour per location)
 *  - Geolocation API integration with fallback to manual input
 *  - Geocoding for city name -> coordinates
 *  - Graceful degradation on API errors
 *
 * Open-Meteo API:
 *  - Weather: https://api.open-meteo.com/v1/forecast
 *  - Geocoding: https://geocoding-api.open-meteo.com/v1/search
 *
 * Privacy:
 *  - Only city-level coordinates are sent (rounded to 2 decimal places)
 *  - No API key or user identification sent
 *  - No data shared beyond Open-Meteo
 */

const WeatherService = (() => {
  'use strict';

  const CACHE_KEY = `${Preferences.STORAGE_PREFIX}weather_cache`;
  const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
  const MIN_FETCH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes minimum between fetches

  const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
  const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

  let _lastFetchTime = 0;
  let _currentPromise = null;

  /**
   * Get cached weather data if still valid.
   * @returns {Object|null}
   */
  function _getCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;

      const cached = JSON.parse(raw);
      const age = Date.now() - cached.timestamp;

      if (age > CACHE_TTL_MS) return null;
      return cached;
    } catch {
      return null;
    }
  }

  /**
   * Store weather data in cache.
   */
  function _setCache(data) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          ...data,
          timestamp: Date.now(),
        })
      );
    } catch {
      // localStorage full or unavailable — continue without cache
    }
  }

  /**
   * Clear the weather cache.
   */
  function clearCache() {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      // Ignore
    }
    _lastFetchTime = 0;
  }

  /**
   * Request user's location via Geolocation API.
   * @returns {Promise<{lat: number, lon: number}>}
   */
  function requestGeolocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          let message;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location permission denied. You can set a location manually below.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable. Please enter a location manually.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out. Please try again or enter a location manually.';
              break;
            default:
              message = 'Unable to determine location. Please enter a location manually.';
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // Accept cached position up to 5 minutes old
        }
      );
    });
  }

  /**
   * Geocode a city name to coordinates using Open-Meteo Geocoding API.
   * @param {string} cityName
   * @returns {Promise<{lat: number, lon: number, name: string}>}
   */
  async function geocodeCity(cityName) {
    if (!cityName || !cityName.trim()) {
      throw new Error('Please enter a city name.');
    }

    const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(cityName.trim())}&count=1&language=en`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Geocoding service unavailable.');
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        throw new Error(`Could not find location: "${cityName}". Please try a different city name.`);
      }

      const result = data.results[0];
      return {
        lat: result.latitude,
        lon: result.longitude,
        name: [result.name, result.admin1, result.country].filter(Boolean).join(', '),
      };
    } catch (error) {
      if (error.message.includes('Could not find') || error.message.includes('Please enter')) {
        throw error;
      }
      throw new Error('Unable to look up location. Please check your internet connection.');
    }
  }

  /**
   * Fetch current weather data from Open-Meteo.
   * @param {number} lat - Latitude (rounded for privacy)
   * @param {number} lon - Longitude (rounded for privacy)
   * @returns {Promise<Object>} Weather data
   */
  async function _fetchWeather(lat, lon) {
    // Round coordinates for privacy
    const roundedLat = Math.round(lat * 100) / 100;
    const roundedLon = Math.round(lon * 100) / 100;

    const params = new URLSearchParams({
      latitude: roundedLat.toString(),
      longitude: roundedLon.toString(),
      current_weather: 'true',
      timezone: 'auto',
    });

    const url = `${WEATHER_API_URL}?${params}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.current_weather) {
      throw new Error('Invalid weather data received.');
    }

    return {
      weatherCode: data.current_weather.weathercode,
      temperature: data.current_weather.temperature,
      windSpeed: data.current_weather.windspeed,
      isDay: data.current_weather.is_day === 1,
      time: data.current_weather.time,
    };
  }

  /**
   * Get weather data with caching and rate limiting.
   * @param {boolean} forceRefresh - Skip cache and fetch fresh data
   * @returns {Promise<Object|null>} Weather data or null on error
   */
  async function getWeather(forceRefresh = false) {
    const location = Preferences.getLocation();
    if (!location) return null;

    // Check cache first (unless forcing refresh)
    if (!forceRefresh) {
      const cached = _getCache();
      if (cached && cached.lat === location.lat && cached.lon === location.lon) {
        return cached;
      }
    }

    // Rate limiting: don't fetch more often than MIN_FETCH_INTERVAL
    const timeSinceLastFetch = Date.now() - _lastFetchTime;
    if (!forceRefresh && timeSinceLastFetch < MIN_FETCH_INTERVAL_MS) {
      const cached = _getCache();
      if (cached) return cached;
    }

    // Deduplicate concurrent requests
    if (_currentPromise) return _currentPromise;

    _currentPromise = (async () => {
      try {
        const weatherData = await _fetchWeather(location.lat, location.lon);

        const result = {
          ...weatherData,
          lat: location.lat,
          lon: location.lon,
          locationName: location.name,
        };

        _setCache(result);
        _lastFetchTime = Date.now();

        return result;
      } catch (error) {
        console.warn('WeatherService: fetch failed', error.message);

        // Fall back to stale cache if available
        const staleCache = _getCache();
        if (staleCache) {
          return { ...staleCache, stale: true };
        }

        return null;
      } finally {
        _currentPromise = null;
      }
    })();

    return _currentPromise;
  }

  /**
   * Describe a WMO weather code in human-readable text.
   */
  function describeWeatherCode(code) {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snowfall',
      73: 'Moderate snowfall',
      75: 'Heavy snowfall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown';
  }

  return {
    requestGeolocation,
    geocodeCity,
    getWeather,
    clearCache,
    describeWeatherCode,
  };
})();
