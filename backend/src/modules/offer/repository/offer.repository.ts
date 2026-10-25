import { OfferEntity } from '@/modules/offer/entity/offer.entity';

export interface OfferPage {
  readonly items: OfferEntity[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
}

export interface OfferListQuery {
  readonly limit: number;
  readonly offset: number;
  readonly now: Date;
}

export abstract class OfferRepository {
  abstract listCurrent(query: OfferListQuery): Promise<OfferPage>;
  abstract listCurrentForPlace(placeId: string, query: OfferListQuery): Promise<OfferPage>;

  create(_input: CreateOwnerOfferRepoInput): Promise<{ id: string }> {
    return Promise.reject(new Error('create is not implemented'));
  }

  stop(_placeId: string, _offerId: string, _endsAt: Date): Promise<boolean> {
    return Promise.resolve(false);
  }

  deleteOwned(_placeId: string, _offerId: string): Promise<{ imageKey: string | null } | null> {
    return Promise.resolve(null);
  }
}

export interface CreateOwnerOfferRepoInput {
  readonly placeId: string;
  readonly titleAr: string;
  readonly titleEn: string;
  readonly detailsAr: string;
  readonly detailsEn: string;
  readonly imageKey: string | null;
  readonly startsAt: Date;
  readonly endsAt: Date;
}
