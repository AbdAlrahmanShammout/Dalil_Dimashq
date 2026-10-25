import { OFFER_MAX_WINDOW_MS, assertOfferWindow } from '@/modules/offer/offer-rules';

describe('assertOfferWindow', () => {
  const startsAt = new Date('2026-10-01T00:00:00Z');

  it('allows 60 days and refuses a longer window', () => {
    assertOfferWindow(startsAt, new Date(startsAt.getTime() + OFFER_MAX_WINDOW_MS));
    expect(() =>
      assertOfferWindow(startsAt, new Date(startsAt.getTime() + OFFER_MAX_WINDOW_MS + 1)),
    ).toThrow(expect.objectContaining({ code: 'offer_window' }));
  });
});
