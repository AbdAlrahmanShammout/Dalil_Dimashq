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
}
