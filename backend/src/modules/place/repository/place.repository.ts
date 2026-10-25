import { PlaceEntity } from '@/modules/place/entity/place.entity';

export interface PlaceCounts {
  readonly all: number;
  readonly hotels: number;
  readonly restaurants: number;
  readonly cafes: number;
}

export interface SaveGeocodeRepoInput {
  readonly id: string;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly geocodeFailedAt: Date | null;
}

export interface SaveGeocodeResult {
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly geocodeFailedAt: Date | null;
}

export abstract class PlaceRepository {
  abstract findPublicById(id: string): Promise<PlaceEntity | null>;
  abstract countPublic(): Promise<PlaceCounts>;
  abstract listFeatured(): Promise<PlaceEntity[]>;

  findAnyById(id: string): Promise<PlaceEntity | null> {
    return this.findPublicById(id);
  }

  saveGeocode(input: SaveGeocodeRepoInput): Promise<SaveGeocodeResult> {
    return Promise.resolve({
      latitude: input.latitude,
      longitude: input.longitude,
      geocodeFailedAt: input.geocodeFailedAt,
    });
  }
}
