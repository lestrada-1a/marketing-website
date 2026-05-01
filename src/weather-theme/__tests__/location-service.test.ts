import {
  createManualLocation,
  locationToCacheKey,
} from '../location-service';

describe('Location Service', () => {
  describe('createManualLocation', () => {
    it('should create a manual location source from city and country', () => {
      const source = createManualLocation('London', 'UK');
      expect(source.type).toBe('manual');
      if (source.type === 'manual') {
        expect(source.location.city).toBe('London');
        expect(source.location.country).toBe('UK');
      }
    });

    it('should create a manual location source from city only', () => {
      const source = createManualLocation('Tokyo');
      expect(source.type).toBe('manual');
      if (source.type === 'manual') {
        expect(source.location.city).toBe('Tokyo');
        expect(source.location.country).toBeUndefined();
      }
    });

    it('should trim whitespace from city and country', () => {
      const source = createManualLocation('  Paris  ', '  France  ');
      if (source.type === 'manual') {
        expect(source.location.city).toBe('Paris');
        expect(source.location.country).toBe('France');
      }
    });

    it('should return unavailable for empty city', () => {
      expect(createManualLocation('').type).toBe('unavailable');
      expect(createManualLocation('   ').type).toBe('unavailable');
    });
  });

  describe('locationToCacheKey', () => {
    it('should create a key for geolocation sources', () => {
      const key = locationToCacheKey({
        type: 'geolocation',
        location: { latitude: 51.51, longitude: -0.13, isCoarsened: true },
      });
      expect(key).toBe('geo:51.51,-0.13');
    });

    it('should create a key for manual locations with city only', () => {
      const key = locationToCacheKey({
        type: 'manual',
        location: { city: 'London' },
      });
      expect(key).toBe('manual:london');
    });

    it('should create a key for manual locations with city and country', () => {
      const key = locationToCacheKey({
        type: 'manual',
        location: { city: 'London', country: 'UK' },
      });
      expect(key).toBe('manual:london:uk');
    });

    it('should return "unavailable" for unavailable sources', () => {
      const key = locationToCacheKey({ type: 'unavailable' });
      expect(key).toBe('unavailable');
    });
  });
});
