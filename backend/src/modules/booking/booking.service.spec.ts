import { BookingService } from '@/modules/booking/booking.service';
import { BookingAvailabilityService } from '@/modules/booking/booking-availability.service';
import { BookingGateService } from '@/modules/booking/booking-gate.service';
import { BookingBanRepository } from '@/modules/booking/repository/booking-ban.repository';
import { BookingSettingsRepository } from '@/modules/booking/repository/booking-settings.repository';
import {
  BookingRecord,
  BookingRepository,
  CreateBookingInput,
} from '@/modules/booking/repository/booking.repository';
import { PlaceService } from '@/modules/place/place.service';

class MemoryBookingRepository extends BookingRepository {
  readonly rows: BookingRecord[] = [];

  async findByClientKey(userId: string, clientKey: string): Promise<BookingRecord | null> {
    return this.rows.find((row) => row.clientKey === clientKey) ?? null;
  }

  async create(input: CreateBookingInput): Promise<BookingRecord> {
    const row: BookingRecord = {
      id: `booking-${this.rows.length + 1}`,
      number: this.rows.length + 1,
      clientKey: input.clientKey,
      placeId: input.placeId,
      startsAt: input.startsAt,
      partySize: input.partySize,
      note: input.note,
      offerId: null,
      status: 'pending',
    };
    this.rows.push(row);
    return row;
  }
}

function buildService(repository: BookingRepository): BookingService {
  const places = { getPublicPlace: async (id: string) => ({ id }) } as unknown as PlaceService;
  const settings = new (class extends BookingSettingsRepository {
    async read() {
      return {
        acceptsBookings: true,
        horizonDays: 14,
        noticeMinutes: 60,
        maxParty: 4,
        replyWindowMinutes: 60,
        closedPeriods: [],
        responseHours: [],
        openingHours: [{ dayOfWeek: 0, opensAt: 9 * 60, closesAt: 22 * 60 }],
      };
    }
  })();
  const bans = new (class extends BookingBanRepository {
    async findActive() {
      return null;
    }
  })();
  const availability = new BookingAvailabilityService(places, settings);
  return new BookingService(new BookingGateService(availability, bans), availability, repository);
}

describe('BookingService', () => {
  it('returns the same booking for the same client key', async () => {
    const repository = new MemoryBookingRepository();
    const service = buildService(repository);
    const input = {
      clientKey: 'key-1',
      userId: 'user-1',
      placeId: 'place-1',
      startsAt: new Date('2026-11-01T18:00:00Z'),
      partySize: 2,
      note: null,
      now: new Date('2026-10-25T12:00:00Z'),
    };
    const first = await service.create(input);
    const second = await service.create({ ...input, partySize: 3 });
    expect(second.id).toBe(first.id);
    expect(repository.rows).toHaveLength(1);
  });
});
