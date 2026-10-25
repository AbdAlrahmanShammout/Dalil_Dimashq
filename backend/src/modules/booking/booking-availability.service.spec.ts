import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { BookingAvailabilityService } from '@/modules/booking/booking-availability.service';
import {
  BookingAvailability,
  BookingSettingsRepository,
} from '@/modules/booking/repository/booking-settings.repository';
import { PlaceService } from '@/modules/place/place.service';

class MemoryBookingSettingsRepository extends BookingSettingsRepository {
  async read(placeId: string): Promise<BookingAvailability | null> {
    if (placeId !== 'place-1') {
      return null;
    }
    return {
      acceptsBookings: true,
      horizonDays: 7,
      noticeMinutes: 120,
      maxParty: 4,
      replyWindowMinutes: 30,
      closedPeriods: [
        { startsAt: new Date('2026-11-01T00:00:00Z'), endsAt: new Date('2026-11-02T00:00:00Z') },
      ],
      responseHours: [],
    };
  }
}

describe('BookingAvailabilityService', () => {
  const places = {
    getPublicPlace: async (id: string) => {
      if (id === 'missing') {
        throw new ResourceNotFoundException('Place', id);
      }
      return { id };
    },
  } as unknown as PlaceService;

  it('returns stored rules and closed periods', async () => {
    const actual = await new BookingAvailabilityService(
      places,
      new MemoryBookingSettingsRepository(),
    ).read('place-1');
    expect(actual.acceptsBookings).toBe(true);
    expect(actual.closedPeriods).toHaveLength(1);
  });

  it('keeps bookings closed when the place has no settings', async () => {
    const actual = await new BookingAvailabilityService(
      places,
      new MemoryBookingSettingsRepository(),
    ).read('place-2');
    expect(actual.acceptsBookings).toBe(false);
    expect(actual.horizonDays).toBe(14);
  });
});
