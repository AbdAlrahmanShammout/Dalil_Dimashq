import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { PlaceAmenityEntity } from '@/modules/amenity/entity/place-amenity.entity';
import {
  AmenityCatalogItem,
  AmenityRepository,
} from '@/modules/amenity/repository/amenity.repository';
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

  /**
   * Amenity catalog an owner can attach. The table holds the approved definitions.
   */
  async listCatalog(): Promise<AmenityCatalogItem[]> {
    return this.amenityRepository.listCatalog();
  }

  /**
   * Attaches an amenity by its code.
   */
  async addToPlace(placeId: string, code: string): Promise<void> {
    const attached = await this.amenityRepository.attach(placeId, code);
    if (!attached) {
      throw new ResourceNotFoundException('Amenity', code);
    }
  }

  /**
   * Removes an amenity code from a place.
   */
  async removeFromPlace(placeId: string, code: string): Promise<void> {
    const item = await this.amenityRepository.findCatalogItem(code);
    if (!item) {
      throw new ResourceNotFoundException('Amenity', code);
    }
    await this.amenityRepository.detach(placeId, code);
  }
}
