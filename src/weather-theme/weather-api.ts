/**
 * Weather API Service
 *
 * Fetches weather data from an external weather API provider.
 * Normalizes API responses into our internal WeatherCondition enum.
 *
 * Supports OpenWeatherMap-style APIs by default but is designed to be
 * easily adapted to other providers.
 *
 * Privacy: Only coarsened coordinates or city names are sent to the API.
 * No user identifiers are included in requests.
 */

import {
  LocationSource,
  WeatherApiConfig,
  WeatherApiResponse,
  WeatherCondition,
  WeatherData,
} from './types';

const DEFAULT_CONFIG: WeatherApiConfig = {
  baseUrl: 'https://api.openweathermap.org/data/2.5',
  apiKey: '',
  timeoutMs: 10000,
};

/**
 * Map OpenWeatherMap condition codes to our WeatherCondition enum.
 * See: https://openweathermap.org/weather-conditions
 */
function mapOwmConditionCode(code: number, temp: number): WeatherCondition {
  // Extreme temperature overrides
  if (temp >= 40) return WeatherCondition.ExtremeHeat;
  if (temp <= -15) return WeatherCondition.ExtremeCold;

  // Group-based mapping (OWM uses groups 2xx-8xx)
  if (code >= 200 && code < 300) return WeatherCondition.Stormy; // Thunderstorm
  if (code >= 300 && code < 400) return WeatherCondition.Rainy; // Drizzle
  if (code >= 500 && code < 600) return WeatherCondition.Rainy; // Rain
  if (code >= 600 && code < 700) return WeatherCondition.Snowy; // Snow
  if (code >= 700 && code < 800) return WeatherCondition.Cloudy; // Atmosphere (fog, mist, etc.)
  if (code === 800) return WeatherCondition.Clear; // Clear sky
  if (code > 800 && code < 900) return WeatherCondition.Cloudy; // Clouds

  return WeatherCondition.Unknown;
}

/**
 * Build the API URL for a given location source.
 */
function buildApiUrl(config: WeatherApiConfig, location: LocationSource): string | null {
  const params = new URLSearchParams({
    appid: config.apiKey,
    units: 'metric',
  });

  switch (location.type) {
    case 'geolocation':
      params.set('lat', String(location.location.latitude));
      params.set('lon', String(location.location.longitude));
      break;
    case 'manual':
      params.set(
        'q',
        location.location.country
          ? `${location.location.city},${location.location.country}`
          : location.location.city
      );
      break;
    case 'unavailable':
      return null;
  }

  return `${config.baseUrl}/weather?${params.toString()}`;
}

/**
 * Parse the OpenWeatherMap API response into our normalized format.
 */
function parseOwmResponse(data: Record<string, unknown>): WeatherApiResponse {
  const weather = (data.weather as Array<{ id: number; description: string; icon: string }>)?.[0];
  const main = data.main as { temp: number } | undefined;

  const temp = main?.temp ?? 20;
  const code = weather?.id ?? 0;

  return {
    condition: mapOwmConditionCode(code, temp),
    temperature: temp,
    description: weather?.description ?? 'Unknown',
    icon: weather?.icon ?? '',
  };
}

/**
 * Fetch weather data from the API for a given location.
 *
 * @throws Error if the API request fails or times out
 */
export async function fetchWeatherData(
  location: LocationSource,
  config: Partial<WeatherApiConfig> = {}
): Promise<WeatherData> {
  const fullConfig: WeatherApiConfig = { ...DEFAULT_CONFIG, ...config };
  const url = buildApiUrl(fullConfig, location);

  if (!url) {
    throw new Error('Cannot fetch weather data: location is unavailable');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), fullConfig.timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = parseOwmResponse(data);
    const now = Date.now();

    return {
      condition: parsed.condition,
      temperature: parsed.temperature,
      description: parsed.description,
      icon: parsed.icon,
      fetchedAt: now,
      expiresAt: now + 20 * 60 * 1000, // 20 minute expiry
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Create a mock weather data response for testing or when API is unavailable.
 */
export function createFallbackWeatherData(condition?: WeatherCondition): WeatherData {
  const now = Date.now();
  return {
    condition: condition ?? WeatherCondition.Unknown,
    temperature: 20,
    description: 'Weather data unavailable',
    icon: '',
    fetchedAt: now,
    expiresAt: now + 20 * 60 * 1000,
  };
}

// Export for testing
export { mapOwmConditionCode, buildApiUrl, parseOwmResponse };
