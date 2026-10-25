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
  /**
   * Adds a catalog amenity with both names and a sort order.
   */
  async createAmenity(input: {
    readonly code: string;
    readonly nameAr: string;
    readonly nameEn: string;
    readonly sortOrder: number;
  }): Promise<AmenityCatalogItem> {
    return this.amenityRepository.createAmenity(input);
  }

  /**
   * Updates names, code, and sort order.
   */
  async updateAmenity(
    id: string,
    input: {
      readonly code: string;
      readonly nameAr: string;
      readonly nameEn: string;
      readonly sortOrder: number;
    },
  ): Promise<AmenityCatalogItem> {
    const item = await this.amenityRepository.updateAmenity(id, input);
    if (!item) {
      throw new ResourceNotFoundException('Amenity', id);
    }
    return item;
  }

  /**
   * Removes a catalog amenity and its place links.
   */
  async deleteAmenity(id: string): Promise<void> {
    const removed = await this.amenityRepository.deleteAmenity(id);
    if (!removed) {
      throw new ResourceNotFoundException('Amenity', id);
    }
  }

  async removeFromPlace(placeId: string, code: string): Promise<void> {
    const item = await this.amenityRepository.findCatalogItem(code);
    if (!item) {
      throw new ResourceNotFoundException('Amenity', code);
    }
    await this.amenityRepository.detach(placeId, code);
  }
}
