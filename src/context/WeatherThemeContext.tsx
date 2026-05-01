'use client';

/**
 * Weather Theme Context Provider
 *
 * Manages the global state for weather-based theme toggling.
 * Handles geolocation, weather fetching, caching, and preference persistence.
 */

import React, { createContext, useContext, useCallback, useEffect, useReducer } from 'react';
import {
  WeatherData,
  WeatherTheme,
  WeatherThemePreferences,
  WeatherServiceStatus,
  WeatherThemeContextValue,
} from '@/types/weather';
import { getThemeForCondition } from '@/lib/weather-themes';
import {
  fetchWeatherData,
  requestGeolocation,
  clearWeatherCache,
  savePreferences,
  loadPreferences,
} from '@/lib/weather-service';

/** Default preferences - theme is OFF by default for all users */
const DEFAULT_PREFERENCES: WeatherThemePreferences = {
  enabled: false,
  projectOverrides: {},
  manualLocation: null,
  locationPermission: 'prompt',
};

interface WeatherThemeState {
  weather: WeatherData | null;
  theme: WeatherTheme | null;
  preferences: WeatherThemePreferences;
  status: WeatherServiceStatus;
  errorMessage: string | null;
}

type WeatherThemeAction =
  | { type: 'SET_WEATHER'; payload: WeatherData }
  | { type: 'SET_STATUS'; payload: WeatherServiceStatus }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'TOGGLE_ENABLED' }
  | { type: 'SET_PROJECT_OVERRIDE'; payload: { projectId: string; enabled: boolean } }
  | { type: 'REMOVE_PROJECT_OVERRIDE'; payload: string }
  | { type: 'SET_MANUAL_LOCATION'; payload: string }
  | { type: 'SET_LOCATION_PERMISSION'; payload: WeatherThemePreferences['locationPermission'] }
  | { type: 'LOAD_PREFERENCES'; payload: WeatherThemePreferences }
  | { type: 'CLEAR_DATA' };

function weatherThemeReducer(
  state: WeatherThemeState,
  action: WeatherThemeAction
): WeatherThemeState {
  switch (action.type) {
    case 'SET_WEATHER': {
      const theme = getThemeForCondition(action.payload.condition);
      return { ...state, weather: action.payload, theme, status: 'success', errorMessage: null };
    }
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_ERROR':
      return { ...state, status: 'error', errorMessage: action.payload };
    case 'TOGGLE_ENABLED': {
      const newPrefs = { ...state.preferences, enabled: !state.preferences.enabled };
      if (!newPrefs.enabled) {
        // When disabling, clear weather data for privacy
        return {
          ...state,
          preferences: newPrefs,
          weather: null,
          theme: null,
          status: 'idle',
          errorMessage: null,
        };
      }
      return { ...state, preferences: newPrefs };
    }
    case 'SET_PROJECT_OVERRIDE': {
      const projectOverrides = {
        ...state.preferences.projectOverrides,
        [action.payload.projectId]: action.payload.enabled,
      };
      return { ...state, preferences: { ...state.preferences, projectOverrides } };
    }
    case 'REMOVE_PROJECT_OVERRIDE': {
      const { [action.payload]: _, ...remaining } = state.preferences.projectOverrides;
      return { ...state, preferences: { ...state.preferences, projectOverrides: remaining } };
    }
    case 'SET_MANUAL_LOCATION':
      return {
        ...state,
        preferences: { ...state.preferences, manualLocation: action.payload || null },
      };
    case 'SET_LOCATION_PERMISSION':
      return {
        ...state,
        preferences: { ...state.preferences, locationPermission: action.payload },
      };
    case 'LOAD_PREFERENCES':
      return { ...state, preferences: action.payload };
    case 'CLEAR_DATA':
      return {
        ...state,
        weather: null,
        theme: null,
        preferences: DEFAULT_PREFERENCES,
        status: 'idle',
        errorMessage: null,
      };
    default:
      return state;
  }
}

const WeatherThemeContext = createContext<WeatherThemeContextValue | null>(null);

export function WeatherThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(weatherThemeReducer, {
    weather: null,
    theme: null,
    preferences: DEFAULT_PREFERENCES,
    status: 'idle',
    errorMessage: null,
  });

  // Load saved preferences on mount
  useEffect(() => {
    const saved = loadPreferences();
    if (saved) {
      dispatch({
        type: 'LOAD_PREFERENCES',
        payload: {
          ...DEFAULT_PREFERENCES,
          ...(saved as Partial<WeatherThemePreferences>),
        },
      });
    }
  }, []);

  // Persist preferences when they change
  useEffect(() => {
    savePreferences(state.preferences as unknown as Record<string, unknown>);
  }, [state.preferences]);

  // Fetch weather when enabled and location is available
  const doFetchWeather = useCallback(async () => {
    if (!state.preferences.enabled) return;

    dispatch({ type: 'SET_STATUS', payload: 'loading' });

    try {
      let weatherData: WeatherData | null = null;

      if (state.preferences.manualLocation) {
        // Use manual location
        weatherData = await fetchWeatherData(state.preferences.manualLocation);
      } else if (state.preferences.locationPermission === 'granted') {
        // Use geolocation
        const location = await requestGeolocation();
        if (location) {
          weatherData = await fetchWeatherData(location);
        } else {
          dispatch({ type: 'SET_LOCATION_PERMISSION', payload: 'denied' });
          dispatch({ type: 'SET_STATUS', payload: 'permission_denied' });
          return;
        }
      } else {
        // No location available
        dispatch({ type: 'SET_STATUS', payload: 'idle' });
        return;
      }

      if (weatherData) {
        dispatch({ type: 'SET_WEATHER', payload: weatherData });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Unable to fetch weather data. Using default theme.' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Weather service temporarily unavailable. Using default theme.' });
    }
  }, [state.preferences.enabled, state.preferences.manualLocation, state.preferences.locationPermission]);

  // Auto-fetch weather when preferences change
  useEffect(() => {
    if (state.preferences.enabled) {
      doFetchWeather();

      // Set up periodic refresh (every 20 minutes)
      const interval = setInterval(doFetchWeather, 20 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [state.preferences.enabled, state.preferences.manualLocation, state.preferences.locationPermission, doFetchWeather]);

  const toggleEnabled = useCallback(() => {
    dispatch({ type: 'TOGGLE_ENABLED' });
    if (state.preferences.enabled) {
      // Turning off - clear cache for privacy
      clearWeatherCache();
    }
  }, [state.preferences.enabled]);

  const setProjectOverride = useCallback((projectId: string, enabled: boolean) => {
    dispatch({ type: 'SET_PROJECT_OVERRIDE', payload: { projectId, enabled } });
  }, []);

  const removeProjectOverride = useCallback((projectId: string) => {
    dispatch({ type: 'REMOVE_PROJECT_OVERRIDE', payload: projectId });
  }, []);

  const setManualLocation = useCallback((location: string) => {
    dispatch({ type: 'SET_MANUAL_LOCATION', payload: location });
  }, []);

  const requestLocation = useCallback(async () => {
    const location = await requestGeolocation();
    if (location) {
      dispatch({ type: 'SET_LOCATION_PERMISSION', payload: 'granted' });
    } else {
      dispatch({ type: 'SET_LOCATION_PERMISSION', payload: 'denied' });
    }
  }, []);

  const refreshWeather = useCallback(async () => {
    await doFetchWeather();
  }, [doFetchWeather]);

  const isActiveForProject = useCallback(
    (projectId: string) => {
      // Check for project-specific override first
      if (projectId in state.preferences.projectOverrides) {
        return state.preferences.projectOverrides[projectId];
      }
      // Fall back to global setting
      return state.preferences.enabled;
    },
    [state.preferences.enabled, state.preferences.projectOverrides]
  );

  const contextValue: WeatherThemeContextValue = {
    weather: state.weather,
    theme: state.preferences.enabled ? state.theme : null,
    preferences: state.preferences,
    status: state.status,
    errorMessage: state.errorMessage,
    toggleEnabled,
    setProjectOverride,
    removeProjectOverride,
    setManualLocation,
    requestLocation,
    refreshWeather,
    isActiveForProject,
  };

  return (
    <WeatherThemeContext.Provider value={contextValue}>
      {children}
    </WeatherThemeContext.Provider>
  );
}

/**
 * Hook to access the weather theme context.
 * Must be used within a WeatherThemeProvider.
 */
export function useWeatherTheme(): WeatherThemeContextValue {
  const context = useContext(WeatherThemeContext);
  if (!context) {
    throw new Error('useWeatherTheme must be used within a WeatherThemeProvider');
  }
  return context;
}
