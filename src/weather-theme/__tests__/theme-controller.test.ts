import { WeatherThemeController } from '../theme-controller';
import { WeatherCondition, WeatherThemeEvent } from '../types';

// Mock the weather-api module
jest.mock('../weather-api', () => ({
  fetchWeatherData: jest.fn(),
  createFallbackWeatherData: jest.requireActual('../weather-api').createFallbackWeatherData,
}));

// Mock the location-service module
jest.mock('../location-service', () => ({
  ...jest.requireActual('../location-service'),
  resolveLocation: jest.fn(),
}));

import { fetchWeatherData } from '../weather-api';
import { resolveLocation } from '../location-service';

const mockFetchWeatherData = fetchWeatherData as jest.MockedFunction<typeof fetchWeatherData>;
const mockResolveLocation = resolveLocation as jest.MockedFunction<typeof resolveLocation>;

function createController(overrides: Partial<ConstructorParameters<typeof WeatherThemeController>[0]> = {}) {
  return new WeatherThemeController({
    apiKey: 'test-key',
    refreshIntervalMs: 0, // Disable auto-refresh in tests
    ...overrides,
  });
}

describe('WeatherThemeController', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Default mock: location available, weather clear
    mockResolveLocation.mockResolvedValue({
      type: 'geolocation',
      location: { latitude: 51.51, longitude: -0.13, isCoarsened: true },
    });
    mockFetchWeatherData.mockResolvedValue({
      condition: WeatherCondition.Clear,
      temperature: 22,
      description: 'Clear sky',
      icon: '01d',
      fetchedAt: Date.now(),
      expiresAt: Date.now() + 1200000,
    });
  });

  describe('initialization', () => {
    it('should not fetch weather when disabled (default)', async () => {
      const controller = createController();
      await controller.initialize();

      expect(mockResolveLocation).not.toHaveBeenCalled();
      expect(mockFetchWeatherData).not.toHaveBeenCalled();
      expect(controller.getCurrentTheme()).toBeNull();
    });

    it('should fetch weather when enabled before init', async () => {
      // Pre-enable via localStorage
      localStorage.setItem(
        'weather-theme-preferences',
        JSON.stringify({ enabled: true, projectOverrides: {}, boardOverrides: {}, updatedAt: 0 })
      );

      const controller = createController();
      await controller.initialize();

      expect(mockResolveLocation).toHaveBeenCalled();
      expect(mockFetchWeatherData).toHaveBeenCalled();
      expect(controller.getCurrentTheme()).not.toBeNull();
      expect(controller.getCurrentTheme()!.condition).toBe(WeatherCondition.Clear);

      controller.destroy();
    });
  });

  describe('toggle', () => {
    it('should default to off', () => {
      const controller = createController();
      expect(controller.isEnabled()).toBe(false);
    });

    it('should enable and fetch weather on toggle on', async () => {
      const controller = createController();
      await controller.initialize();

      await controller.setEnabled(true);
      expect(controller.isEnabled()).toBe(true);
      expect(mockResolveLocation).toHaveBeenCalled();
      expect(controller.getCurrentTheme()).not.toBeNull();

      controller.destroy();
    });

    it('should remove theme on toggle off', async () => {
      const controller = createController();
      await controller.initialize();

      await controller.setEnabled(true);
      expect(controller.getCurrentTheme()).not.toBeNull();

      await controller.setEnabled(false);
      expect(controller.getCurrentTheme()).toBeNull();

      controller.destroy();
    });

    it('should emit ToggleChanged event', async () => {
      const controller = createController();
      await controller.initialize();

      const handler = jest.fn();
      controller.on(WeatherThemeEvent.ToggleChanged, handler);

      await controller.setEnabled(true);
      expect(handler).toHaveBeenCalledWith({ enabled: true });

      controller.destroy();
    });
  });

  describe('context-specific enable', () => {
    it('should check project overrides', async () => {
      const controller = createController();
      await controller.initialize();
      await controller.setEnabled(true);

      controller.setProjectOverride('proj-1', false);
      expect(controller.isEnabledForContext({ projectId: 'proj-1' })).toBe(false);
      expect(controller.isEnabledForContext({ projectId: 'proj-2' })).toBe(true);

      controller.destroy();
    });

    it('should check board overrides', async () => {
      const controller = createController();
      await controller.initialize();
      await controller.setEnabled(true);

      controller.setBoardOverride('board-1', false);
      expect(controller.isEnabledForContext({ boardId: 'board-1' })).toBe(false);
      expect(controller.isEnabledForContext({ boardId: 'board-2' })).toBe(true);

      controller.destroy();
    });

    it('should return false for all contexts when globally disabled', () => {
      const controller = createController();
      expect(controller.isEnabledForContext({ projectId: 'proj-1' })).toBe(false);
      expect(controller.isEnabledForContext({ boardId: 'board-1' })).toBe(false);
    });
  });

  describe('graceful degradation', () => {
    it('should apply fallback when location is unavailable', async () => {
      mockResolveLocation.mockResolvedValue({ type: 'unavailable' });

      const controller = createController();
      await controller.initialize();

      const fallbackHandler = jest.fn();
      controller.on(WeatherThemeEvent.FallbackActivated, fallbackHandler);

      await controller.setEnabled(true);
      expect(fallbackHandler).toHaveBeenCalledWith(
        expect.objectContaining({ reason: 'Location unavailable' })
      );
      expect(controller.getCurrentTheme()).toBeNull();

      controller.destroy();
    });

    it('should apply fallback when weather API fails', async () => {
      mockFetchWeatherData.mockRejectedValue(new Error('API error'));

      const controller = createController();
      await controller.initialize();

      const errorHandler = jest.fn();
      controller.on(WeatherThemeEvent.Error, errorHandler);

      await controller.setEnabled(true);
      expect(errorHandler).toHaveBeenCalled();
      // Should not crash — theme falls back gracefully
      expect(controller.getCurrentTheme()).toBeNull();

      controller.destroy();
    });
  });

  describe('manual location', () => {
    it('should set manual location and refresh', async () => {
      const controller = createController();
      await controller.initialize();
      await controller.setEnabled(true);

      jest.clearAllMocks();
      mockResolveLocation.mockResolvedValue({
        type: 'manual',
        location: { city: 'Tokyo' },
      });
      mockFetchWeatherData.mockResolvedValue({
        condition: WeatherCondition.Rainy,
        temperature: 18,
        description: 'Light rain',
        icon: '10d',
        fetchedAt: Date.now(),
        expiresAt: Date.now() + 1200000,
      });

      await controller.setManualLocation('Tokyo');
      expect(controller.getCurrentTheme()!.condition).toBe(WeatherCondition.Rainy);

      controller.destroy();
    });
  });

  describe('destroy', () => {
    it('should clean up resources', async () => {
      const controller = createController();
      await controller.initialize();
      await controller.setEnabled(true);

      controller.destroy();
      expect(controller.getCurrentTheme()).toBeNull();
    });
  });
});
