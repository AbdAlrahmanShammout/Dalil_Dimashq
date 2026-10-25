export const RATING_STAR_MIN = 1;
export const RATING_STAR_MAX = 5;

export type RatingStatusName = 'held' | 'counted' | 'rejected';

export interface RatingRecord {
  readonly id: string;
  readonly userId: string;
  readonly placeId: string;
  readonly stars: number;
  readonly status: RatingStatusName;
}

export interface CreateRatingRepoInput {
  readonly userId: string;
  readonly placeId: string;
  readonly stars: number;
}

export abstract class RatingRepository {
  abstract findByVisitor(userId: string, placeId: string): Promise<RatingRecord | null>;
  abstract findById(id: string): Promise<RatingRecord | null>;
  abstract create(input: CreateRatingRepoInput): Promise<RatingRecord>;
  abstract listCounted(placeId: string): Promise<RatingRecord[]>;
  abstract markStatus(id: string, status: RatingStatusName): Promise<RatingRecord>;
}
