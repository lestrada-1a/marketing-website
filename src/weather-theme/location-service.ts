/**
 * Location Service
 *
 * Handles location detection via browser Geolocation API with
 * fallback to manual location entry.
 *
 * Privacy considerations:
 * - Coordinates are coarsened to ~1km precision (2 decimal places)
 * - No precise location is stored persistently
 * - Manual location stores only city/country names
 * - Location data is only used to fetch weather, never shared beyond
 *   the configured weather API provider
 */

import {
  GeoLocation,
  LocationPermissionStatus,
  LocationSource,
  ManualLocation,
} from './types';

/** Coarsen coordinates to ~1km precision for privacy */
function coarsenCoordinates(lat: number, lon: number): GeoLocation {
  return {
    latitude: Math.round(lat * 100) / 100,
    longitude: Math.round(lon * 100) / 100,
    isCoarsened: true,
  };
}

/**
 * Check the current geolocation permission status without triggering a prompt.
 */
export async function checkPermissionStatus(): Promise<LocationPermissionStatus> {
  if (typeof navigator === 'undefined' || !navigator.permissions) {
    return LocationPermissionStatus.Unavailable;
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    switch (result.state) {
      case 'granted':
        return LocationPermissionStatus.Granted;
      case 'denied':
        return LocationPermissionStatus.Denied;
      case 'prompt':
        return LocationPermissionStatus.Prompt;
      default:
        return LocationPermissionStatus.Unavailable;
    }
  } catch {
    return LocationPermissionStatus.Unavailable;
  }
}

/**
 * Request the user's geolocation via the browser Geolocation API.
 * Returns coarsened coordinates for privacy.
 *
 * @param timeoutMs - Maximum time to wait for location (default: 10s)
 */
export function requestGeolocation(timeoutMs = 10000): Promise<LocationSource> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve({ type: 'unavailable' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coarsened = coarsenCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
        resolve({ type: 'geolocation', location: coarsened });
      },
      () => {
        // Permission denied or error — resolve as unavailable
        resolve({ type: 'unavailable' });
      },
      {
        enableHighAccuracy: false, // Low accuracy is sufficient and more privacy-friendly
        timeout: timeoutMs,
        maximumAge: 600000, // Accept cached position up to 10 minutes old
      }
    );
  });
}

/**
 * Create a LocationSource from a manually specified location.
 */
export function createManualLocation(city: string, country?: string): LocationSource {
  if (!city || city.trim().length === 0) {
    return { type: 'unavailable' };
  }

  const location: ManualLocation = {
    city: city.trim(),
    country: country?.trim() || undefined,
  };

  return { type: 'manual', location };
}

/**
 * Resolve the best available location source.
 * Priority: geolocation > manual location > unavailable
 *
 * @param manualLocation - Optional manual location fallback
 * @param timeoutMs - Geolocation timeout
 */
export async function resolveLocation(
  manualLocation?: ManualLocation,
  timeoutMs = 10000
): Promise<LocationSource> {
  // First, try browser geolocation
  const permStatus = await checkPermissionStatus();

  if (
    permStatus === LocationPermissionStatus.Granted ||
    permStatus === LocationPermissionStatus.Prompt
  ) {
    const geoResult = await requestGeolocation(timeoutMs);
    if (geoResult.type === 'geolocation') {
      return geoResult;
    }
  }

  // Fall back to manual location if provided
  if (manualLocation && manualLocation.city) {
    return createManualLocation(manualLocation.city, manualLocation.country);
  }

  return { type: 'unavailable' };
}

/**
 * Generate a cache key from a location source.
 * Used for weather data caching per location.
 */
export function locationToCacheKey(source: LocationSource): string {
  switch (source.type) {
    case 'geolocation':
      return `geo:${source.location.latitude},${source.location.longitude}`;
    case 'manual':
      return `manual:${source.location.city.toLowerCase()}${
        source.location.country ? `:${source.location.country.toLowerCase()}` : ''
      }`;
    case 'unavailable':
      return 'unavailable';
  }
}
