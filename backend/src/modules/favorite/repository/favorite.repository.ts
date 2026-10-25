export interface FavoritePlace {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly type: string;
}

export abstract class FavoriteRepository {
  abstract add(userId: string, placeId: string): Promise<void>;
  abstract remove(userId: string, placeId: string): Promise<boolean>;
  abstract list(userId: string): Promise<FavoritePlace[]>;
}
