import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';

import { prepareOwnerPhoto } from '@/modules/place-photo/owner-photo-rules';

export const OFFER_MAX_WINDOW_MS = 60 * 24 * 60 * 60 * 1000;

/**
 * An offer window is at most 60 days and must end after it starts.
 */
export function assertOfferWindow(startsAt: Date, endsAt: Date): void {
  const span = endsAt.getTime() - startsAt.getTime();
  if (span <= 0 || span > OFFER_MAX_WINDOW_MS) {
    throw new InvalidStateException({ message: 'Offer window is invalid', code: 'offer_window' });
  }
}

/**
 * Optional offer image. The place photo count does not apply.
 */
export function prepareOfferImage(input: {
  readonly placeId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly byteLength: number;
}): { key: string } {
  return prepareOwnerPhoto({ ...input, existingCount: 0 });
}
