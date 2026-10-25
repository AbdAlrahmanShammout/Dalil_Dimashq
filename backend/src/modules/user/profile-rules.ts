const SYRIAN_MOBILE = /^(?:\+963|00963|963|0)?(9\d{8})$/;
const NAME_PATTERN = /^(?=.{2,40}$)[^\d]+$/u;
const OLDEST_BIRTH_YEAR = 1900;
const MINIMUM_AGE_YEARS = 16;
const DAMASCUS_OFFSET_MS = 3 * 60 * 60 * 1000;

export function normalizeSyrianPhone(value: string): string | null {
  const compact = value.replace(/[\s()-]/g, '');
  const match = compact.match(SYRIAN_MOBILE);
  if (!match) {
    return null;
  }
  return `+963${match[1]}`;
}

export function isPersonName(value: string): boolean {
  return NAME_PATTERN.test(value.trim());
}

export function damascusYear(now: Date): number {
  return new Date(now.getTime() + DAMASCUS_OFFSET_MS).getUTCFullYear();
}

export function isOldEnough(birthYear: number, now: Date): boolean {
  return damascusYear(now) - birthYear >= MINIMUM_AGE_YEARS;
}

export function isBirthYearInRange(birthYear: number, now: Date): boolean {
  return birthYear >= OLDEST_BIRTH_YEAR && birthYear <= damascusYear(now);
}
