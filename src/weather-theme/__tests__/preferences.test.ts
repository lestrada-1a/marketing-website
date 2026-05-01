import { PreferencesManager } from '../preferences';

describe('PreferencesManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('default state', () => {
    it('should default to disabled', () => {
      const prefs = new PreferencesManager();
      expect(prefs.isEnabled()).toBe(false);
    });

    it('should have no manual location by default', () => {
      const prefs = new PreferencesManager();
      expect(prefs.getManualLocation()).toBeUndefined();
    });

    it('should have no overrides by default', () => {
      const prefs = new PreferencesManager();
      expect(prefs.getProjectOverrides()).toEqual({});
      expect(prefs.getBoardOverrides()).toEqual({});
    });
  });

  describe('global toggle', () => {
    it('should enable and disable the theme', () => {
      const prefs = new PreferencesManager();
      prefs.setEnabled(true);
      expect(prefs.isEnabled()).toBe(true);

      prefs.setEnabled(false);
      expect(prefs.isEnabled()).toBe(false);
    });

    it('should persist across instances', () => {
      const prefs1 = new PreferencesManager();
      prefs1.setEnabled(true);

      const prefs2 = new PreferencesManager();
      expect(prefs2.isEnabled()).toBe(true);
    });
  });

  describe('manual location', () => {
    it('should set and get a manual location', () => {
      const prefs = new PreferencesManager();
      prefs.setManualLocation({ city: 'London', country: 'UK' });

      const loc = prefs.getManualLocation();
      expect(loc?.city).toBe('London');
      expect(loc?.country).toBe('UK');
    });

    it('should clear the manual location', () => {
      const prefs = new PreferencesManager();
      prefs.setManualLocation({ city: 'London' });
      prefs.setManualLocation(undefined);
      expect(prefs.getManualLocation()).toBeUndefined();
    });
  });

  describe('project overrides', () => {
    it('should use global setting when no override exists', () => {
      const prefs = new PreferencesManager();
      prefs.setEnabled(true);
      expect(prefs.isEnabledForProject('proj-1')).toBe(true);

      prefs.setEnabled(false);
      expect(prefs.isEnabledForProject('proj-1')).toBe(false);
    });

    it('should use project override when set', () => {
      const prefs = new PreferencesManager();
      prefs.setEnabled(true);
      prefs.setProjectOverride('proj-1', false);

      expect(prefs.isEnabledForProject('proj-1')).toBe(false);
      expect(prefs.isEnabledForProject('proj-2')).toBe(true); // No override
    });

    it('should allow enabling per-project even when globally disabled', () => {
      const prefs = new PreferencesManager();
      prefs.setEnabled(false);
      prefs.setProjectOverride('proj-1', true);

      expect(prefs.isEnabledForProject('proj-1')).toBe(true);
    });

    it('should remove an override', () => {
      const prefs = new PreferencesManager();
      prefs.setEnabled(true);
      prefs.setProjectOverride('proj-1', false);
      prefs.setProjectOverride('proj-1', undefined);

      expect(prefs.isEnabledForProject('proj-1')).toBe(true); // Back to global
    });
  });

  describe('board overrides', () => {
    it('should use board override when set', () => {
      const prefs = new PreferencesManager();
      prefs.setEnabled(true);
      prefs.setBoardOverride('board-1', false);

      expect(prefs.isEnabledForBoard('board-1')).toBe(false);
    });

    it('should fall back to global when no board override', () => {
      const prefs = new PreferencesManager();
      prefs.setEnabled(true);
      expect(prefs.isEnabledForBoard('board-x')).toBe(true);
    });
  });

  describe('onChange listener', () => {
    it('should notify on preference changes', () => {
      const prefs = new PreferencesManager();
      const listener = jest.fn();
      prefs.onChange(listener);

      prefs.setEnabled(true);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true })
      );
    });

    it('should support unsubscribe', () => {
      const prefs = new PreferencesManager();
      const listener = jest.fn();
      const unsub = prefs.onChange(listener);

      prefs.setEnabled(true);
      expect(listener).toHaveBeenCalledTimes(1);

      unsub();
      prefs.setEnabled(false);
      expect(listener).toHaveBeenCalledTimes(1); // Not called again
    });
  });

  describe('reset', () => {
    it('should reset all preferences to defaults', () => {
      const prefs = new PreferencesManager();
      prefs.setEnabled(true);
      prefs.setManualLocation({ city: 'Tokyo' });
      prefs.setProjectOverride('p1', false);
      prefs.setBoardOverride('b1', true);

      prefs.reset();

      expect(prefs.isEnabled()).toBe(false);
      expect(prefs.getManualLocation()).toBeUndefined();
      expect(prefs.getProjectOverrides()).toEqual({});
      expect(prefs.getBoardOverrides()).toEqual({});
    });
  });

  describe('clearOverrides', () => {
    it('should clear all overrides but keep other settings', () => {
      const prefs = new PreferencesManager();
      prefs.setEnabled(true);
      prefs.setProjectOverride('p1', false);
      prefs.setBoardOverride('b1', true);

      prefs.clearOverrides();

      expect(prefs.isEnabled()).toBe(true);
      expect(prefs.getProjectOverrides()).toEqual({});
      expect(prefs.getBoardOverrides()).toEqual({});
    });
  });
});
