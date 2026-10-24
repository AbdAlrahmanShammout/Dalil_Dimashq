import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceRepository } from '@/modules/place/repository/place.repository';
import { PlaceCounts } from '@/modules/place/repository/place.repository';

@Injectable()
export class PlaceService {
  constructor(private readonly placeRepository: PlaceRepository) {}

  /**
   * Public place summary. Hidden places are not found.
   */
  async getPublicPlace(id: string): Promise<PlaceEntity> {
    const place = await this.placeRepository.findPublicById(id);
    if (!place) {
      throw new ResourceNotFoundException('Place', id);
    }
    return place;
  }

  /**
   * Public totals. Hotels include hotel, guest house, hostel, and motel.
   */
  async countPublicPlaces(): Promise<PlaceCounts> {
    return this.placeRepository.countPublic();
  }
}
