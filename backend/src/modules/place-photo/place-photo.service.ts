import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { PlaceService } from '@/modules/place/place.service';
import { PlacePhotoEntity, PlacePhotoRole } from '@/modules/place-photo/entity/place-photo.entity';
import { prepareOwnerPhoto } from '@/modules/place-photo/owner-photo-rules';
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

  /**
   * Stores an owner photo only after the type, size, and count checks pass.
   */
  async storeOwnerPhoto(input: {
    readonly placeId: string;
    readonly fileName: string;
    readonly mimeType: string;
    readonly bytes: Uint8Array;
  }): Promise<{ key: string }> {
    const existingCount = await this.placePhotoRepository.countByPlace(input.placeId);
    const prepared = prepareOwnerPhoto({
      placeId: input.placeId,
      fileName: input.fileName,
      mimeType: input.mimeType,
      byteLength: input.bytes.byteLength,
      existingCount,
    });
    await this.photoStorage.uploadObject({
      key: prepared.key,
      body: input.bytes,
      contentType: input.mimeType,
    });
    return prepared;
  }

  /**
   * Uploads the file and stores the object key. No presigned upload URL is issued.
   */
  async addOwnerPhoto(input: {
    readonly placeId: string;
    readonly fileName: string;
    readonly mimeType: string;
    readonly bytes: Uint8Array;
  }): Promise<{ id: string; objectKey: string }> {
    const stored = await this.storeOwnerPhoto(input);
    return this.placePhotoRepository.create({ placeId: input.placeId, objectKey: stored.key });
  }

  /**
   * Assigns the cover or the logo. The previous photo in that role returns to the gallery.
   */
  async assignRole(placeId: string, photoId: string, role: 'cover' | 'logo'): Promise<void> {
    const assigned = await this.placePhotoRepository.assignRole(placeId, photoId, role);
    if (!assigned) {
      throw new ResourceNotFoundException('Photo', photoId);
    }
  }

  /**
   * Removes the owner's photo row and the stored object.
   */
  async removeOwnerPhoto(placeId: string, photoId: string): Promise<void> {
    const removed = await this.placePhotoRepository.deleteOwned(placeId, photoId);
    if (!removed) {
      throw new ResourceNotFoundException('Photo', photoId);
    }
    await this.photoStorage.deleteObject(removed.objectKey);
  }

  /**
   * A missing file is refused before storage.
   */
  requirePhotoFile(file: { buffer?: Uint8Array } | undefined): Uint8Array {
    if (!file?.buffer || file.buffer.byteLength === 0) {
      throw new InvalidStateException({ message: 'Photo type is invalid', code: 'photo_invalid' });
    }
    return file.buffer;
  }
}
