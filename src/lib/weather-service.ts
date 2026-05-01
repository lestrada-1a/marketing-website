/**
 * Weather Service
 *
 * Fetches weather data from Open-Meteo API (free, no API key required).
 * Implements caching to limit API calls to at most once every 20 minutes per location.
 *
 * Privacy Design:
 * - Uses Open-Meteo (open-source, no API key, no tracking)
 * - Coordinates are rounded to ~11km precision (1 decimal place) before caching
 * - Precise coordinates are never stored; only rounded values used as cache keys
 * - Cache is stored in memory and localStorage (city-level granularity only)
 * - All location data is cleared when the user disables the feature
 *
 * Data Retention:
 * - In-memory cache: cleared on page unload
 * - localStorage cache: weather data expires after 30 minutes
 * - Manual location name: persisted until user clears it or disables feature
 * - No server-side storage of location data
 */

import {
  WeatherData,
  LocationData,
  WeatherCacheEntry,
  WeatherCondition,
} from '@/types/weather';
import { mapWeatherCodeToCondition, getWeatherDescription } from './weather-themes';

/** Cache duration: 20 minutes in milliseconds */
const CACHE_DURATION_MS = 20 * 60 * 1000;

/** Maximum cache age before forced refresh: 30 minutes */
const MAX_CACHE_AGE_MS = 30 * 60 * 1000;

/** Precision for coordinate rounding (~11km at equator) */
const COORDINATE_PRECISION = 1;

/** localStorage key for weather cache */
const CACHE_STORAGE_KEY = 'weather-theme-cache';

/** localStorage key for user preferences */
const PREFS_STORAGE_KEY = 'weather-theme-preferences';

/**
 * In-memory weather cache to minimize API calls.
 */
let memoryCache: WeatherCacheEntry | null = null;

/**
 * Round coordinates to reduce precision for privacy.
 * 1 decimal place ≈ 11.1km resolution.
 */
export function roundCoordinates(lat: number, lon: number): { lat: number; lon: number } {
  return {
    lat: Math.round(lat * Math.pow(10, COORDINATE_PRECISION)) / Math.pow(10, COORDINATE_PRECISION),
    lon: Math.round(lon * Math.pow(10, COORDINATE_PRECISION)) / Math.pow(10, COORDINATE_PRECISION),
  };
}

/**
 * Generate a cache key from coordinates (rounded) or city name.
 */
function getCacheKey(location: LocationData | string): string {
  if (typeof location === 'string') {
    return `city:${location.toLowerCase().trim()}`;
  }
  const rounded = roundCoordinates(location.latitude, location.longitude);
  return `coords:${rounded.lat},${rounded.lon}`;
}

/**
 * Get cached weather data if still valid.
 */
function getCachedWeather(locationKey: string): WeatherData | null {
  // Check memory cache first
  if (memoryCache && memoryCache.locationKey === locationKey) {
    if (Date.now() < memoryCache.data.expiresAt) {
      return memoryCache.data;
    }
  }

  // Check localStorage cache
  try {
    const stored = localStorage.getItem(CACHE_STORAGE_KEY);
    if (stored) {
      const entry: WeatherCacheEntry = JSON.parse(stored);
      if (entry.locationKey === locationKey && Date.now() < entry.data.expiresAt) {
        // Restore to memory cache
        memoryCache = entry;
        return entry.data;
      }
    }
  } catch {
    // localStorage unavailable or corrupted - continue without cache
  }

  return null;
}

/**
 * Store weather data in cache.
 */
function setCachedWeather(locationKey: string, data: WeatherData): void {
  const entry: WeatherCacheEntry = { locationKey, data };
  memoryCache = entry;

  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage unavailable - memory cache still works
  }
}

/**
 * Request the user's geolocation via the browser API.
 * Returns null if permission is denied or unavailable.
 */
export async function requestGeolocation(): Promise<LocationData | null> {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        // Permission denied or error
        resolve(null);
      },
      {
        enableHighAccuracy: false, // Low accuracy is sufficient and more privacy-friendly
        timeout: 10000,
        maximumAge: CACHE_DURATION_MS,
      }
    );
  });
}

/**
 * Geocode a city name to coordinates using Open-Meteo's geocoding API.
 */
export async function geocodeCity(cityName: string): Promise<LocationData | null> {
  try {
    const encodedCity = encodeURIComponent(cityName.trim());
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1&language=en&format=json`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      cityName: result.name,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch current weather data from Open-Meteo API.
 * Open-Meteo is free, open-source, and requires no API key.
 * No user data is sent beyond the (rounded) coordinates.
 */
export async function fetchWeatherData(
  location: LocationData | string
): Promise<WeatherData | null> {
  let coords: { latitude: number; longitude: number };
  let locationName: string;

  // Resolve location to coordinates
  if (typeof location === 'string') {
    const geocoded = await geocodeCity(location);
    if (!geocoded) {
      return null;
    }
    coords = { latitude: geocoded.latitude, longitude: geocoded.longitude };
    locationName = geocoded.cityName ?? location;
  } else {
    coords = { latitude: location.latitude, longitude: location.longitude };
    locationName = location.cityName ?? 'Current Location';
  }

  // Round coordinates for privacy before making API call
  const rounded = roundCoordinates(coords.latitude, coords.longitude);

  // Check cache before making API call
  const cacheKey = getCacheKey(
    typeof location === 'string'
      ? location
      : { latitude: coords.latitude, longitude: coords.longitude }
  );
  const cached = getCachedWeather(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${rounded.lat}&longitude=${rounded.lon}&current=temperature_2m,weather_code&timezone=auto`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const current = data.current;

    if (!current) {
      return null;
    }

    const temperature = current.temperature_2m;
    const weatherCode = current.weather_code;
    const condition = mapWeatherCodeToCondition(weatherCode, temperature);
    const now = Date.now();

    const weatherData: WeatherData = {
      condition,
      temperature,
      description: getWeatherDescription(weatherCode),
      locationName,
      fetchedAt: now,
      expiresAt: now + CACHE_DURATION_MS,
    };

    setCachedWeather(cacheKey, weatherData);
    return weatherData;
  } catch {
    return null;
  }
}

/**
 * Clear all cached weather and location data.
 * Called when the user disables the weather theme feature.
 */
export function clearWeatherCache(): void {
  memoryCache = null;
  try {
    localStorage.removeItem(CACHE_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Clear all weather-related data from storage.
 * Called for complete privacy cleanup.
 */
export function clearAllWeatherData(): void {
  clearWeatherCache();
  try {
    localStorage.removeItem(PREFS_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Save user preferences to localStorage.
 */
export function savePreferences(prefs: Record<string, unknown>): void {
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore
  }
}

/**
 * Load user preferences from localStorage.
 */
export function loadPreferences(): Record<string, unknown> | null {
  try {
    const stored = localStorage.getItem(PREFS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
