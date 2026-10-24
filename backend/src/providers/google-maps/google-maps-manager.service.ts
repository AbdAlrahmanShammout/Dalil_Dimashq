import { Injectable } from '@nestjs/common';
import { Client, Status } from '@googlemaps/google-maps-services-js';

import { DependencyFailureException } from '@/common/exceptions/dependency-failure.exception';
import { GoogleMapsConfigService } from '@/config/google-maps/google-maps-config.service';
import { GeocodeResult } from '@/providers/google-maps/defs/geocode-result.defs';
import { GoogleMapsNotConfiguredException } from '@/providers/google-maps/exceptions/google-maps-not-configured.exception';

@Injectable()
export class GoogleMapsManagerService {
  private readonly client = new Client();

  constructor(private readonly googleMapsConfigService: GoogleMapsConfigService) {}

  /**
   * Turns one address into a coordinate. Callers store the result; this does not search nearby places.
   */
  async geocodeAddress(address: string): Promise<GeocodeResult> {
    if (!this.googleMapsConfigService.isConfigured) {
      throw new GoogleMapsNotConfiguredException();
    }
    const response = await this.client.geocode({
      params: { address, key: this.googleMapsConfigService.apiKey },
    });
    const location = response.data.results[0]?.geometry.location;
    if (response.data.status !== Status.OK || !location) {
      throw new DependencyFailureException({
        message: 'The address could not be geocoded',
        code: 'geocode_failed',
      });
    }
    return { latitude: location.lat, longitude: location.lng };
  }
}
