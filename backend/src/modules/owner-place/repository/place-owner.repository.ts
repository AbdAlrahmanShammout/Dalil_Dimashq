export interface OwnedPlaceSummary {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly type: string;
  readonly addressAr: string | null;
  readonly addressEn: string | null;
  readonly premiumActive: boolean;
  readonly premiumEndsAt: Date | null;
  readonly pendingRequestCount: number;
}

export abstract class PlaceOwnerRepository {
  abstract listByUser(userId: string, now: Date): Promise<OwnedPlaceSummary[]>;

  isLinked(_userId: string, _placeId: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
