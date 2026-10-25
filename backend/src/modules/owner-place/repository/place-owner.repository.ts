export interface OwnedPlaceSummary {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly type: string;
  readonly addressAr: string | null;
  readonly addressEn: string | null;
}

export abstract class PlaceOwnerRepository {
  abstract listByUser(userId: string): Promise<OwnedPlaceSummary[]>;

  isLinked(_userId: string, _placeId: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
