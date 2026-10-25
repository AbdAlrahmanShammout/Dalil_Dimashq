export type PlaceChangeKindName = 'claim' | 'edit' | 'remove' | 'report' | 'unlink';
export type PlaceChangeStatusName = 'pending' | 'approved' | 'rejected';

export interface PlaceChangeRecord {
  readonly id: string;
  readonly placeId: string;
  readonly userId: string;
  readonly kind: PlaceChangeKindName;
  readonly status: PlaceChangeStatusName;
  readonly reason: string | null;
  readonly decisionNote: string | null;
}

export interface CreatePlaceChangeRepoInput {
  readonly placeId: string;
  readonly userId: string;
  readonly kind: PlaceChangeKindName;
  readonly reason: string | null;
  readonly payload: Record<string, unknown> | null;
}

export interface PlaceChangePending extends PlaceChangeRecord {
  readonly payload: Record<string, unknown> | null;
}

export interface ApprovedChangeEffect {
  readonly kind: PlaceChangeKindName;
  readonly placeId: string;
  readonly userId: string;
  readonly fields: ApprovedPlaceFields;
  readonly hours: readonly ApprovedHourPeriod[] | null;
}

export interface ApprovedPlaceFields {
  readonly nameAr?: string;
  readonly nameEn?: string;
  readonly type?: string;
  readonly addressAr?: string | null;
  readonly addressEn?: string | null;
}

export interface ApprovedHourPeriod {
  readonly dayOfWeek: number;
  readonly opensAt: number;
  readonly closesAt: number;
}

export interface ApplyChangeDecisionInput {
  readonly id: string;
  readonly approved: boolean;
  readonly note: string;
  readonly effect: ApprovedChangeEffect | null;
}

export abstract class PlaceChangeRepository {
  abstract create(input: CreatePlaceChangeRepoInput): Promise<PlaceChangeRecord>;
  abstract listByPlace(placeId: string): Promise<PlaceChangeRecord[]>;

  findById(_id: string): Promise<PlaceChangePending | null> {
    return Promise.resolve(null);
  }

  applyDecision(_input: ApplyChangeDecisionInput): Promise<PlaceChangeRecord | null> {
    return Promise.resolve(null);
  }
}
