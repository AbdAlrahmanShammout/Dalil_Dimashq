import { GoogleMapsConfigService } from '@/config/google-maps/google-maps-config.service';
import { GoogleMapsManagerService } from '@/providers/google-maps/google-maps-manager.service';
import { GoogleMapsNotConfiguredException } from '@/providers/google-maps/exceptions/google-maps-not-configured.exception';

const geocode = jest.fn();

jest.mock('@googlemaps/google-maps-services-js', () => ({
  Status: { OK: 'OK', ZERO_RESULTS: 'ZERO_RESULTS' },
  Client: jest.fn().mockImplementation(() => ({ geocode })),
}));

describe('GoogleMapsManagerService', () => {
  it('refuses to geocode when the key is unset', async () => {
    const config = { isConfigured: false } as GoogleMapsConfigService;
    const service = new GoogleMapsManagerService(config);
    await expect(service.geocodeAddress('Damascus')).rejects.toBeInstanceOf(
      GoogleMapsNotConfiguredException,
    );
  });

  it('returns the first coordinate', async () => {
    geocode.mockResolvedValue({
      data: { status: 'OK', results: [{ geometry: { location: { lat: 33.5, lng: 36.3 } } }] },
    });
    const config = { isConfigured: true, apiKey: 'test-key' } as GoogleMapsConfigService;
    const service = new GoogleMapsManagerService(config);
    await expect(service.geocodeAddress('Damascus')).resolves.toEqual({
      latitude: 33.5,
      longitude: 36.3,
    });
  });
});
