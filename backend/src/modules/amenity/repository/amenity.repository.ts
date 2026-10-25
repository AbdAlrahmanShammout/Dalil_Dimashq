import { PlaceAmenityEntity } from '@/modules/amenity/entity/place-amenity.entity';

export interface AmenityCatalogItem {
  readonly id: string;
  readonly code: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly sortOrder: number;
}

export interface SaveAmenityInput {
  readonly code: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly sortOrder: number;
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

  createAmenity(_input: SaveAmenityInput): Promise<AmenityCatalogItem> {
    return Promise.reject(new Error('createAmenity is not implemented'));
  }

  updateAmenity(_id: string, _input: SaveAmenityInput): Promise<AmenityCatalogItem | null> {
    return Promise.resolve(null);
  }

  deleteAmenity(_id: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
