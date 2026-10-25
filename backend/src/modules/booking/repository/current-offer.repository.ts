export abstract class CurrentOfferRepository {
  abstract findCurrentId(placeId: string, offerId: string, now: Date): Promise<string | null>;
}
