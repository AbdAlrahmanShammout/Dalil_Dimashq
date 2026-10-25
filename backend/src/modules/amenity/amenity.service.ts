import { Injectable } from '@nestjs/common';

import { PlaceAmenityEntity } from '@/modules/amenity/entity/place-amenity.entity';
import { AmenityRepository } from '@/modules/amenity/repository/amenity.repository';
import { PlaceService } from '@/modules/place/place.service';

@Injectable()
export class AmenityService {
  constructor(
    private readonly placeService: PlaceService,
    private readonly amenityRepository: AmenityRepository,
  ) {}

  /**
   * Approved amenity chips for a public place, in sort order.
   */
  async listApproved(placeId: string): Promise<PlaceAmenityEntity[]> {
    await this.placeService.getPublicPlace(placeId);
    return this.amenityRepository.listByPlace(placeId);
  }
}
