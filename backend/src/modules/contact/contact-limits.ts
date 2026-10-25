import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';

const DAMASCUS_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
export const CONTACT_HOURLY_LIMIT = 5;
export const CONTACT_DAILY_LIMIT = 40;
export const CONTACT_BODY_MAX_BYTES = 16 * 1024;
export const HOUR_MS = 60 * 60 * 1000;

export function damascusDayStart(now: Date): Date {
  const shifted = new Date(now.getTime() + DAMASCUS_OFFSET_MS);
  const midnightUtc = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
  );
  return new Date(midnightUtc - DAMASCUS_OFFSET_MS);
}

export function damascusDayEnd(now: Date): Date {
  return new Date(damascusDayStart(now).getTime() + DAY_MS);
}

export async function assertMessageQuota(
  countSince: (visitorKey: string, since: Date) => Promise<number>,
  visitorKey: string,
  now: Date,
  code: string,
): Promise<void> {
  const hourly = await countSince(visitorKey, new Date(now.getTime() - HOUR_MS));
  if (hourly >= CONTACT_HOURLY_LIMIT) {
    throw new InvalidStateException({ message: 'Hourly message limit', code });
  }
  const daily = await countSince(visitorKey, damascusDayStart(now));
  if (daily >= CONTACT_DAILY_LIMIT) {
    throw new InvalidStateException({ message: 'Daily message limit', code });
  }
}
