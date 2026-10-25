import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceStatus, PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceCounts, PlaceRepository } from '@/modules/place/repository/place.repository';
import { PlaceService } from '@/modules/place/place.service';
import { PlacePhotoEntity, PlacePhotoRole } from '@/modules/place-photo/entity/place-photo.entity';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
import { PlacePhotoService } from '@/modules/place-photo/place-photo.service';
import { PlacePhotoRepository } from '@/modules/place-photo/repository/place-photo.repository';

class MemoryPlaceRepository extends PlaceRepository {
  async findPublicById(): Promise<PlaceEntity> {
    return new PlaceEntity({
      id: 'place-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      nameAr: 'بيت',
      nameEn: 'House',
      type: PlaceType.Cafe,
      status: PlaceStatus.Active,
      areaId: 'area-1',
      addressAr: null,
      addressEn: null,
      latitude: null,
      longitude: null,
      isFeatured: false,
      starValue: null,
      starSource: null,
      phone: null,
      website: null,
      email: null,
      facebook: null,
      instagram: null,
    });
  }

  async countPublic(): Promise<PlaceCounts> {
    return { all: 0, hotels: 0, restaurants: 0, cafes: 0 };
  }

  async listFeatured(): Promise<PlaceEntity[]> {
    return [];
  }
}

class MemoryPhotoRepository extends PlacePhotoRepository {
  async listVisible(): Promise<PlacePhotoEntity[]> {
    return [
      new PlacePhotoEntity({
        id: 'cover-1',
        objectKey: 'cover.jpg',
        role: PlacePhotoRole.Cover,
        hidden: false,
        sortOrder: 0,
      }),
      new PlacePhotoEntity({
        id: 'logo-1',
        objectKey: 'logo.jpg',
        role: PlacePhotoRole.Logo,
        hidden: false,
        sortOrder: 1,
      }),
    ];
  }
}

class MemoryStorage extends PhotoStorage {
  readonly uploads: string[] = [];

  async createReadUrl(key: string): Promise<string> {
    return `https://files.test/${key}`;
  }

  override async uploadObject(input: { key: string }): Promise<void> {
    this.uploads.push(input.key);
  }
}

describe('PlacePhotoService', () => {
  it('returns read urls for the cover and the logo', async () => {
    const actual = await new PlacePhotoService(
      new PlaceService(new MemoryPlaceRepository()),
      new MemoryPhotoRepository(),
      new MemoryStorage(),
    ).listPhotos('place-1');
    expect(actual.coverUrl).toBe('https://files.test/cover.jpg');
    expect(actual.logoUrl).toBe('https://files.test/logo.jpg');
    expect(actual.photos).toHaveLength(2);
  });

  it('refuses a bad photo before storage and stores a valid one at place/file', async () => {
    const storage = new MemoryStorage();
    const service = new PlacePhotoService(
      new PlaceService(new MemoryPlaceRepository()),
      new MemoryPhotoRepository(),
      storage,
    );
    await expect(
      service.storeOwnerPhoto({
        placeId: 'place-1',
        fileName: 'front.gif',
        mimeType: 'image/gif',
        bytes: Uint8Array.from([1, 2, 3]),
      }),
    ).rejects.toMatchObject({ code: 'photo_invalid' });
    expect(storage.uploads).toEqual([]);
    const stored = await service.storeOwnerPhoto({
      placeId: 'place-1',
      fileName: 'front.jpg',
      mimeType: 'image/jpeg',
      bytes: Uint8Array.from([1, 2, 3]),
    });
    expect(stored.key).toBe('place-1/front.jpg');
    expect(storage.uploads).toEqual(['place-1/front.jpg']);
  });
});
