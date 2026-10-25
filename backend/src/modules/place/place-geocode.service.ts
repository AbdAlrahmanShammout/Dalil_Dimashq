import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { PlaceRepository, SaveGeocodeResult } from '@/modules/place/repository/place.repository';
import { GoogleMapsManagerService } from '@/providers/google-maps/google-maps-manager.service';

@Injectable()
export class PlaceGeocodeService {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly googleMapsManagerService: GoogleMapsManagerService,
  ) {}

  /**
   * Geocodes one address and stores the coordinate. A failure keeps the previous coordinate.
   */
  async saveAddress(input: {
    readonly placeId: string;
    readonly address: string;
  }): Promise<SaveGeocodeResult> {
    const place = await this.placeRepository.findAnyById(input.placeId);
    if (!place) {
      throw new ResourceNotFoundException('Place', input.placeId);
    }
    try {
      const point = await this.googleMapsManagerService.geocodeAddress(input.address);
      return this.placeRepository.saveGeocode({
        id: place.id,
        latitude: point.latitude,
        longitude: point.longitude,
        geocodeFailedAt: null,
      });
    } catch {
      return this.placeRepository.saveGeocode({
        id: place.id,
        latitude: place.latitude,
        longitude: place.longitude,
        geocodeFailedAt: new Date(),
      });
    }
  }
}
