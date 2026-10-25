export interface PlaceNameMatch {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly type: string;
  readonly addressAr: string | null;
  readonly addressEn: string | null;
}

export interface PlaceNamePage {
  readonly places: PlaceNameMatch[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
}

export interface ImmediatePlaceFields {
  readonly phone?: string | null;
  readonly website?: string | null;
  readonly email?: string | null;
  readonly facebook?: string | null;
  readonly instagram?: string | null;
  readonly descriptionAr?: string | null;
  readonly descriptionEn?: string | null;
}

export interface OwnerPlaceDetail {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly type: string;
  readonly addressAr: string | null;
  readonly addressEn: string | null;
}

export interface ClaimTarget {
  readonly claimCode: string | null;
}

export interface SearchPlacesByNameInput {
  readonly name: string;
  readonly limit: number;
  readonly offset: number;
}

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
  abstract searchByName(input: SearchPlacesByNameInput): Promise<PlaceNamePage>;
  abstract findClaimTarget(placeId: string): Promise<ClaimTarget | null>;
  abstract linkOwner(userId: string, placeId: string): Promise<void>;
  abstract findDetail(placeId: string): Promise<OwnerPlaceDetail | null>;
  abstract isPremium(placeId: string, now: Date): Promise<boolean>;
  abstract updateImmediate(
    placeId: string,
    fields: ImmediatePlaceFields,
  ): Promise<ImmediatePlaceFields>;

  isLinked(_userId: string, _placeId: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
