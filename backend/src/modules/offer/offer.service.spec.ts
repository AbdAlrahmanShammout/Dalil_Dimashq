import { OfferEntity } from '@/modules/offer/entity/offer.entity';
import { OfferService } from '@/modules/offer/offer.service';
import {
  OfferListQuery,
  OfferPage,
  OfferRepository,
} from '@/modules/offer/repository/offer.repository';
import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceStatus, PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceCounts, PlaceRepository } from '@/modules/place/repository/place.repository';
import { PlaceService } from '@/modules/place/place.service';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';

class MemoryOfferRepository extends OfferRepository {
  async listCurrent(query: OfferListQuery): Promise<OfferPage> {
    return {
      items: [
        new OfferEntity({
          id: 'offer-1',
          placeId: 'place-1',
          titleAr: 'عرض',
          titleEn: 'Deal',
          detailsAr: 'تفاصيل',
          detailsEn: 'Details',
          imageKey: null,
          endsAt: new Date('2026-12-01T00:00:00Z'),
        }),
      ],
      total: 1,
      limit: query.limit,
      offset: query.offset,
    };
  }

  async listCurrentForPlace(): Promise<OfferPage> {
    return { items: [], total: 0, limit: 20, offset: 0 };
  }
}

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

class MemoryStorage extends PhotoStorage {
  async createReadUrl(key: string): Promise<string> {
    return `https://files.test/${key}`;
  }
}

describe('OfferService', () => {
  it('defaults the page and leaves a missing image empty', async () => {
    const actual = await new OfferService(
      new MemoryOfferRepository(),
      new PlaceService(new MemoryPlaceRepository()),
      new MemoryStorage(),
    ).listCurrentOffers({});
    expect(actual.limit).toBe(20);
    expect(actual.offset).toBe(0);
    expect(actual.total).toBe(1);
    expect(actual.items[0].imageUrl).toBeNull();
    expect(actual.items[0].titleEn).toBe('Deal');
  });
});
