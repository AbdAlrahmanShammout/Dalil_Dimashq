import { assertBookableSlot } from '@/modules/booking/booking-slot';
import { BookingAvailability } from '@/modules/booking/repository/booking-settings.repository';

const availability: BookingAvailability = {
  acceptsBookings: true,
  horizonDays: 14,
  noticeMinutes: 60,
  maxParty: 4,
  replyWindowMinutes: 60,
  closedPeriods: [
    { startsAt: new Date('2026-11-02T00:00:00Z'), endsAt: new Date('2026-11-03T00:00:00Z') },
  ],
  responseHours: [{ dayOfWeek: 0, opensAt: 10 * 60, closesAt: 20 * 60 }],
  openingHours: [{ dayOfWeek: 0, opensAt: 9 * 60, closesAt: 22 * 60 }],
};

describe('assertBookableSlot', () => {
  const now = new Date('2026-10-25T12:00:00Z');

  it('accepts a Sunday afternoon inside both hour windows', () => {
    expect(() =>
      assertBookableSlot({ startsAt: new Date('2026-11-01T12:00:00Z'), now, availability }),
    ).not.toThrow();
  });

  it('refuses notice, closed hours, and blackouts', () => {
    expect(() =>
      assertBookableSlot({ startsAt: new Date('2026-10-25T12:30:00Z'), now, availability }),
    ).toThrow(expect.objectContaining({ code: 'slot_unavailable' }));
    expect(() =>
      assertBookableSlot({ startsAt: new Date('2026-11-01T18:30:00Z'), now, availability }),
    ).toThrow(expect.objectContaining({ code: 'slot_unavailable' }));
    expect(() =>
      assertBookableSlot({ startsAt: new Date('2026-11-02T12:00:00Z'), now, availability }),
    ).toThrow(expect.objectContaining({ code: 'slot_unavailable' }));
  });
});
