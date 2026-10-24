export enum PlaceType {
  Restaurant = 'restaurant',
  FastFood = 'fast_food',
  Cafe = 'cafe',
  Hotel = 'hotel',
  GuestHouse = 'guest_house',
  Hostel = 'hostel',
  Motel = 'motel',
}

export enum PlaceStatus {
  Active = 'active',
  TemporarilyClosed = 'temporarily_closed',
  PermanentlyClosed = 'permanently_closed',
  Hidden = 'hidden',
}

export const HOTEL_PLACE_TYPES = [
  PlaceType.Hotel,
  PlaceType.GuestHouse,
  PlaceType.Hostel,
  PlaceType.Motel,
] as const;

export const RESTAURANT_PLACE_TYPES = [PlaceType.Restaurant, PlaceType.FastFood] as const;

export const DEFAULT_PAGE_LIMIT = 20;
export const DEFAULT_PAGE_OFFSET = 0;

export type PhotoFallbackKind = 'hotel' | 'restaurant' | 'cafe';

export function resolvePhotoFallback(type: PlaceType): PhotoFallbackKind {
  if (type === PlaceType.Cafe) {
    return 'cafe';
  }
  if (
    type === PlaceType.Hotel ||
    type === PlaceType.GuestHouse ||
    type === PlaceType.Hostel ||
    type === PlaceType.Motel
  ) {
    return 'hotel';
  }
  return 'restaurant';
}
