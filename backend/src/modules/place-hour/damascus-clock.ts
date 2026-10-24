const DAMASCUS_OFFSET_MS = 3 * 60 * 60 * 1000;

export interface DamascusClock {
  readonly dayOfWeek: number;
  readonly minutes: number;
}

/**
 * Asia/Damascus is UTC+3 all year.
 */
export function readDamascusClock(now: Date): DamascusClock {
  const shifted = new Date(now.getTime() + DAMASCUS_OFFSET_MS);
  return {
    dayOfWeek: shifted.getUTCDay(),
    minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
}

export function isOpenAt(
  periods: ReadonlyArray<{ opensAt: number; closesAt: number }>,
  minutes: number,
): boolean {
  return periods.some((period) => {
    if (period.opensAt <= period.closesAt) {
      return minutes >= period.opensAt && minutes < period.closesAt;
    }
    return minutes >= period.opensAt || minutes < period.closesAt;
  });
}
