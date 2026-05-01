import { WeatherThemeEventEmitter } from '../event-emitter';
import { WeatherThemeEvent } from '../types';

describe('WeatherThemeEventEmitter', () => {
  let emitter: WeatherThemeEventEmitter;

  beforeEach(() => {
    emitter = new WeatherThemeEventEmitter();
  });

  describe('on/emit', () => {
    it('should call handlers when events are emitted', () => {
      const handler = jest.fn();
      emitter.on(WeatherThemeEvent.ToggleChanged, handler);

      emitter.emit(WeatherThemeEvent.ToggleChanged, { enabled: true });
      expect(handler).toHaveBeenCalledWith({ enabled: true });
    });

    it('should support multiple handlers for the same event', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      emitter.on(WeatherThemeEvent.ToggleChanged, handler1);
      emitter.on(WeatherThemeEvent.ToggleChanged, handler2);

      emitter.emit(WeatherThemeEvent.ToggleChanged, { enabled: false });
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should not call handlers for different events', () => {
      const handler = jest.fn();
      emitter.on(WeatherThemeEvent.ToggleChanged, handler);

      emitter.emit(WeatherThemeEvent.ThemeChanged, { theme: null });
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('should stop receiving events after unsubscribe', () => {
      const handler = jest.fn();
      const unsub = emitter.on(WeatherThemeEvent.ToggleChanged, handler);

      emitter.emit(WeatherThemeEvent.ToggleChanged, { enabled: true });
      expect(handler).toHaveBeenCalledTimes(1);

      unsub();
      emitter.emit(WeatherThemeEvent.ToggleChanged, { enabled: false });
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('once', () => {
    it('should only fire handler once', () => {
      const handler = jest.fn();
      emitter.once(WeatherThemeEvent.ToggleChanged, handler);

      emitter.emit(WeatherThemeEvent.ToggleChanged, { enabled: true });
      emitter.emit(WeatherThemeEvent.ToggleChanged, { enabled: false });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ enabled: true });
    });
  });

  describe('off', () => {
    it('should remove all handlers for a specific event', () => {
      const handler = jest.fn();
      emitter.on(WeatherThemeEvent.ToggleChanged, handler);

      emitter.off(WeatherThemeEvent.ToggleChanged);
      emitter.emit(WeatherThemeEvent.ToggleChanged, { enabled: true });

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all handlers for all events', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      emitter.on(WeatherThemeEvent.ToggleChanged, handler1);
      emitter.on(WeatherThemeEvent.ThemeChanged, handler2);

      emitter.removeAllListeners();

      emitter.emit(WeatherThemeEvent.ToggleChanged, { enabled: true });
      emitter.emit(WeatherThemeEvent.ThemeChanged, { theme: null });

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('error isolation', () => {
    it('should not break other handlers when one throws', () => {
      const errorHandler = jest.fn(() => {
        throw new Error('Handler error');
      });
      const goodHandler = jest.fn();

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      emitter.on(WeatherThemeEvent.ToggleChanged, errorHandler);
      emitter.on(WeatherThemeEvent.ToggleChanged, goodHandler);

      emitter.emit(WeatherThemeEvent.ToggleChanged, { enabled: true });

      expect(errorHandler).toHaveBeenCalled();
      expect(goodHandler).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
