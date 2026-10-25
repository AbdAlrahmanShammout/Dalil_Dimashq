export const RECENT_PLACE_LIMIT = 20;

export interface RecentPlaceSummary {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly type: string;
  readonly viewedAt: Date;
}

export abstract class RecentPlaceRepository {
  abstract record(userId: string, placeId: string, viewedAt: Date): Promise<void>;
  abstract list(userId: string, limit: number): Promise<RecentPlaceSummary[]>;
}
