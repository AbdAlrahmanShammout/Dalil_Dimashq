import { BookingGateService } from '@/modules/booking/booking-gate.service';
import { BookingAvailabilityService } from '@/modules/booking/booking-availability.service';
import { BookingBanRepository } from '@/modules/booking/repository/booking-ban.repository';
import { BookingSettingsRepository } from '@/modules/booking/repository/booking-settings.repository';
import { PlaceService } from '@/modules/place/place.service';

class OpenSettingsRepository extends BookingSettingsRepository {
  constructor(private readonly acceptsBookings: boolean) {
    super();
  }

  async read(): Promise<{
    acceptsBookings: boolean;
    horizonDays: number;
    noticeMinutes: number;
    maxParty: number;
    replyWindowMinutes: number;
    closedPeriods: [];
    responseHours: [];
    openingHours: [];
  }> {
    return {
      acceptsBookings: this.acceptsBookings,
      horizonDays: 14,
      noticeMinutes: 60,
      maxParty: 8,
      replyWindowMinutes: 60,
      closedPeriods: [],
      responseHours: [],
      openingHours: [],
    };
  }
}

class MemoryBanRepository extends BookingBanRepository {
  constructor(private readonly banned: boolean) {
    super();
  }

  async findActive(): Promise<{ level: number; endsAt: Date | null } | null> {
    return this.banned ? { level: 1, endsAt: new Date('2026-12-01T00:00:00Z') } : null;
  }
}

function buildGate(acceptsBookings: boolean, banned: boolean): BookingGateService {
  const places = { getPublicPlace: async (id: string) => ({ id }) } as unknown as PlaceService;
  return new BookingGateService(
    new BookingAvailabilityService(places, new OpenSettingsRepository(acceptsBookings)),
    new MemoryBanRepository(banned),
  );
}

describe('BookingGateService', () => {
  it('refuses a closed place and an active ban', async () => {
    await expect(
      buildGate(false, false).assertOpen({ userId: 'user-1', placeId: 'place-1' }),
    ).rejects.toMatchObject({
      code: 'booking_closed',
    });
    await expect(
      buildGate(true, true).assertOpen({ userId: 'user-1', placeId: 'place-1' }),
    ).rejects.toMatchObject({
      code: 'booking_banned',
    });
    await expect(
      buildGate(true, false).assertOpen({ userId: 'user-1', placeId: 'place-1' }),
    ).resolves.toBeUndefined();
  });
});
