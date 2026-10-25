import { Injectable } from '@nestjs/common';

import { PlaceService } from '@/modules/place/place.service';
import {
  RECENT_PLACE_LIMIT,
  RecentPlaceRepository,
  RecentPlaceSummary,
} from '@/modules/recent-view/repository/recent-place.repository';

@Injectable()
export class RecentPlaceService {
  constructor(
    private readonly placeService: PlaceService,
    private readonly recentPlaceRepository: RecentPlaceRepository,
  ) {}

  /**
   * Records that the caller opened a visible place. Opening it again moves it to the front.
   */
  async record(userId: string, placeId: string, viewedAt: Date = new Date()): Promise<void> {
    await this.placeService.getPublicPlace(placeId);
    await this.recentPlaceRepository.record(userId, placeId, viewedAt);
  }

  /**
   * Latest distinct places the caller opened.
   */
  async list(userId: string): Promise<RecentPlaceSummary[]> {
    return this.recentPlaceRepository.list(userId, RECENT_PLACE_LIMIT);
  }
}
