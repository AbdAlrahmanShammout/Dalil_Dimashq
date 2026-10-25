import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { BookingAvailability } from '@/modules/booking/repository/booking-settings.repository';
import { isOpenAt, readDamascusClock } from '@/modules/place-hour/damascus-clock';

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;

/**
 * A bookable time is after the notice, inside the horizon, during opening and response hours, and outside blackouts.
 */
export function assertBookableSlot(input: {
  readonly startsAt: Date;
  readonly now: Date;
  readonly availability: BookingAvailability;
}): void {
  const earliest = new Date(input.now.getTime() + input.availability.noticeMinutes * MINUTE_MS);
  const latest = new Date(input.now.getTime() + input.availability.horizonDays * DAY_MS);
  const clock = readDamascusClock(input.startsAt);
  const opening = input.availability.openingHours.filter(
    (hour) => hour.dayOfWeek === clock.dayOfWeek,
  );
  const response = input.availability.responseHours.filter(
    (hour) => hour.dayOfWeek === clock.dayOfWeek,
  );
  const blocked = input.availability.closedPeriods.some(
    (period) => input.startsAt >= period.startsAt && input.startsAt < period.endsAt,
  );
  const insideResponse =
    input.availability.responseHours.length === 0 || isOpenAt(response, clock.minutes);
  if (
    input.startsAt < earliest ||
    input.startsAt > latest ||
    !isOpenAt(opening, clock.minutes) ||
    !insideResponse ||
    blocked
  ) {
    throw new InvalidStateException({ message: 'Time is not bookable', code: 'slot_unavailable' });
  }
}
