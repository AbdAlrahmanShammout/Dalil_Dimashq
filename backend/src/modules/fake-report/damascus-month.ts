const DAMASCUS_OFFSET_MS = 3 * 60 * 60 * 1000;

export interface DamascusMonthRange {
  readonly from: Date;
  readonly until: Date;
}

/**
 * The calendar month containing `now` on the Damascus clock, as a UTC range.
 */
export function readDamascusMonth(now: Date): DamascusMonthRange {
  const shifted = new Date(now.getTime() + DAMASCUS_OFFSET_MS);
  const from = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), 1) - DAMASCUS_OFFSET_MS;
  const until =
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, 1) - DAMASCUS_OFFSET_MS;
  return { from: new Date(from), until: new Date(until) };
}
