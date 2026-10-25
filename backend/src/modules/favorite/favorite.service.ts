import { Injectable } from '@nestjs/common';

import {
  FavoritePlace,
  FavoriteRepository,
} from '@/modules/favorite/repository/favorite.repository';
import { PlaceService } from '@/modules/place/place.service';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly placeService: PlaceService,
    private readonly favoriteRepository: FavoriteRepository,
  ) {}

  /**
   * Saves a visible place for the caller. A repeat save changes nothing.
   */
  async add(userId: string, placeId: string): Promise<void> {
    await this.placeService.getPublicPlace(placeId);
    await this.favoriteRepository.add(userId, placeId);
  }

  /**
   * Removes one saved place for the caller.
   */
  async remove(userId: string, placeId: string): Promise<{ removed: boolean }> {
    const removed = await this.favoriteRepository.remove(userId, placeId);
    return { removed };
  }

  /**
   * Visible saved places as summaries.
   */
  async list(userId: string): Promise<FavoritePlace[]> {
    return this.favoriteRepository.list(userId);
  }
}
