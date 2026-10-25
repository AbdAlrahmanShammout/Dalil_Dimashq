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

export abstract class PlaceChangeRepository {
  abstract create(input: CreatePlaceChangeRepoInput): Promise<PlaceChangeRecord>;
  abstract listByPlace(placeId: string): Promise<PlaceChangeRecord[]>;
}
