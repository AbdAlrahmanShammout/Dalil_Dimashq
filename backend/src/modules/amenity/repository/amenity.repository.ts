import { PlaceAmenityEntity } from '@/modules/amenity/entity/place-amenity.entity';

export interface AmenityCatalogItem {
  readonly code: string;
  readonly nameAr: string;
  readonly nameEn: string;
}

export abstract class AmenityRepository {
  abstract listByPlace(placeId: string): Promise<PlaceAmenityEntity[]>;

  listCatalog(): Promise<AmenityCatalogItem[]> {
    return Promise.resolve([]);
  }

  findCatalogItem(_code: string): Promise<AmenityCatalogItem | null> {
    return Promise.resolve(null);
  }

  attach(_placeId: string, _code: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  detach(_placeId: string, _code: string): Promise<void> {
    return Promise.resolve();
  }
}
