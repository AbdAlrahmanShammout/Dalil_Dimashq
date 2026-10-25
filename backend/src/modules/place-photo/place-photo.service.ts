import { Injectable } from '@nestjs/common';

import { PlaceService } from '@/modules/place/place.service';
import { PlacePhotoEntity, PlacePhotoRole } from '@/modules/place-photo/entity/place-photo.entity';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
import { PlacePhotoRepository } from '@/modules/place-photo/repository/place-photo.repository';

export interface PlacePhotoView {
  readonly id: string;
  readonly url: string;
  readonly role: PlacePhotoRole;
}

export interface PlacePhotosResult {
  readonly photos: PlacePhotoView[];
  readonly coverUrl: string | null;
  readonly logoUrl: string | null;
}

@Injectable()
export class PlacePhotoService {
  constructor(
    private readonly placeService: PlaceService,
    private readonly placePhotoRepository: PlacePhotoRepository,
    private readonly photoStorage: PhotoStorage,
  ) {}

  /**
   * Visible photo read URLs. Hidden rows are omitted. No upload URL is issued.
   */
  async listPhotos(placeId: string): Promise<PlacePhotosResult> {
    await this.placeService.getPublicPlace(placeId);
    const photos = await this.placePhotoRepository.listVisible(placeId);
    const views = await Promise.all(photos.map((photo) => this.toView(photo)));
    return {
      photos: views,
      coverUrl: views.find((photo) => photo.role === PlacePhotoRole.Cover)?.url ?? null,
      logoUrl: views.find((photo) => photo.role === PlacePhotoRole.Logo)?.url ?? null,
    };
  }

  private async toView(photo: PlacePhotoEntity): Promise<PlacePhotoView> {
    const url = await this.photoStorage.createReadUrl(photo.objectKey);
    return { id: photo.id, url, role: photo.role };
  }
}
