import { Injectable } from '@nestjs/common';

import { PlaceRepository } from '@/modules/place/repository/place.repository';
import { PlaceService } from '@/modules/place/place.service';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';

export interface PlaceShare {
  readonly title: string;
  readonly description: string;
  readonly imageUrl: string | null;
}

@Injectable()
export class PlaceShareService {
  constructor(
    private readonly placeService: PlaceService,
    private readonly placeRepository: PlaceRepository,
    private readonly photoStorage: PhotoStorage,
  ) {}

  /**
   * JSON fields the website uses to draw a page and a share card. No HTML or image bytes.
   */
  async readShare(placeId: string): Promise<PlaceShare> {
    const place = await this.placeService.getPublicPlace(placeId);
    const coverKey = await this.placeRepository.findCoverKey(placeId);
    const imageUrl = coverKey ? await this.photoStorage.createReadUrl(coverKey) : null;
    return {
      title: place.nameAr,
      description: place.addressAr ?? place.nameEn,
      imageUrl,
    };
  }
}
