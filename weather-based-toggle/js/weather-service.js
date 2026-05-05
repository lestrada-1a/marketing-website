/**
 * Weather Service Module
 *
 * - Geolocation via browser API with manual city fallback
 * - Weather data from Open-Meteo (free, no API key, no tracking)
 * - In-memory + localStorage caching with 30-min TTL
 * - Rate limiting: minimum 15 minutes between fetches
 * - Coordinates coarsened to ~11km for privacy
 */

import { classifyWeatherCode } from './weather-conditions.js';

const CACHE_KEY = 'weather-theme-cache';
const CACHE_TTL_MS = 30 * 60 * 1000;        // 30 minutes
const MIN_FETCH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

let _memoryCache = null;
let _lastFetchTime = 0;
let _pendingRequest = null;

/**
 * Coarsen coordinates to ~11km precision for privacy.
 * Rounds to 1 decimal place (~11.1 km at equator).
 */
function coarsenCoordinates(lat, lon) {
  return {
    lat: Math.round(lat * 10) / 10,
    lon: Math.round(lon * 10) / 10,
  };
}

/**
 * Get user's location via browser Geolocation API.
 * Returns { lat, lon } or throws.
 */
export function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coarsened = coarsenCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
        resolve(coarsened);
      },
      (error) => {
        let message;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. You can set a city manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location unavailable. Please set a city manually.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again or set a city manually.';
            break;
          default:
            message = 'Unable to get location. Please set a city manually.';
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

/**
 * Geocode a city name to coordinates using Open-Meteo Geocoding API.
 * Returns { lat, lon, name, country } or throws.
 */
export async function geocodeCity(cityName) {
  if (!cityName || cityName.trim().length === 0) {
    throw new Error('Please enter a city name');
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName.trim())}&count=1&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Geocoding service unavailable. Please try again later.');
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${cityName}" not found. Please check the spelling and try again.`);
  }

  const result = data.results[0];
  const coarsened = coarsenCoordinates(result.latitude, result.longitude);

  return {
    lat: coarsened.lat,
    lon: coarsened.lon,
    name: result.name,
    country: result.country || '',
  };
}

/**
 * Fetch weather from Open-Meteo API.
 * Returns { condition, temperature, description, wmoCode, windSpeed }.
 */
async function fetchWeatherData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Weather service unavailable');
  }

  const data = await response.json();
  const current = data.current;

  if (!current) {
    throw new Error('No current weather data available');
  }

  const temperature = current.temperature_2m;
  const wmoCode = current.weather_code;
  const windSpeed = current.wind_speed_10m;
  const condition = classifyWeatherCode(wmoCode, temperature);

  // Check for windy override (wind > 50 km/h and not already stormy/extreme)
  let finalCondition = condition;
  if (windSpeed > 50 && condition !== 'stormy' && condition !== 'extreme_heat' && condition !== 'extreme_cold') {
    finalCondition = 'windy';
  }

  return {
    condition: finalCondition,
    temperature,
    wmoCode,
    windSpeed,
    timestamp: Date.now(),
  };
}

/**
 * Read cached weather data (memory first, then localStorage).
 */
function getCachedWeather(lat, lon) {
  const cacheKey = `${lat},${lon}`;

  // Memory cache
  if (_memoryCache && _memoryCache.key === cacheKey) {
    if (Date.now() - _memoryCache.data.timestamp < CACHE_TTL_MS) {
      return _memoryCache.data;
    }
  }

  // localStorage cache
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.key === cacheKey && Date.now() - parsed.data.timestamp < CACHE_TTL_MS) {
        _memoryCache = parsed;
        return parsed.data;
      }
    }
  } catch (e) {
    // ignore
  }

  return null;
}

/**
 * Write weather data to cache.
 */
function setCachedWeather(lat, lon, data) {
  const cacheKey = `${lat},${lon}`;
  const cacheEntry = { key: cacheKey, data };
  _memoryCache = cacheEntry;

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
  } catch (e) {
    // ignore
  }
}

/**
 * Get weather for given coordinates, with caching and rate limiting.
 * Deduplicates concurrent requests.
 */
export async function getWeather(lat, lon) {
  // Check cache first
  const cached = getCachedWeather(lat, lon);
  if (cached) return cached;

  // Rate limit
  const now = Date.now();
  if (now - _lastFetchTime < MIN_FETCH_INTERVAL_MS && _lastFetchTime > 0) {
    // If rate limited but we have stale cache, return it
    if (_memoryCache) return _memoryCache.data;
    // Otherwise allow the fetch
  }

  // Deduplicate concurrent requests
  if (_pendingRequest) return _pendingRequest;

  _pendingRequest = fetchWeatherData(lat, lon)
    .then((data) => {
      setCachedWeather(lat, lon, data);
      _lastFetchTime = Date.now();
      _pendingRequest = null;
      return data;
    })
    .catch((error) => {
      _pendingRequest = null;
      throw error;
    });

  return _pendingRequest;
}

/**
 * Clear all cached weather data.
 */
export function clearWeatherCache() {
  _memoryCache = null;
  _lastFetchTime = 0;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {
    // ignore
  }
}
