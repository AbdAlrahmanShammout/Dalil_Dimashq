import { Injectable } from '@nestjs/common';

import { PlaceService } from '@/modules/place/place.service';
import { isOpenAt, readDamascusClock } from '@/modules/place-hour/damascus-clock';
import { PlaceHourEntity } from '@/modules/place-hour/entity/place-hour.entity';
import {
  PlaceHourRepository,
  RegularHourPeriod,
} from '@/modules/place-hour/repository/place-hour.repository';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { HourSeasonName } from '@/modules/place-hour/entity/place-hour.entity';

export interface OpenNowResult {
  readonly openNow: boolean | null;
}

export interface HoursWeekResult {
  readonly week: HourWeek | null;
  readonly ramadan: HourWeek | null;
}

type HourWeek = Array<{
  readonly dayOfWeek: number;
  readonly periods: Array<{ readonly opensAt: number; readonly closesAt: number }>;
}>;

const WEEK_LENGTH = 7;
const PERIODS_PER_DAY_LIMIT = 3;

@Injectable()
export class PlaceHourService {
  constructor(
    private readonly placeService: PlaceService,
    private readonly placeHourRepository: PlaceHourRepository,
  ) {}

  /**
   * Server decision for whether the place is open in Damascus time.
   * A place with no hours has no label.
   */
  async readOpenNow(placeId: string, now: Date = new Date()): Promise<OpenNowResult> {
    const hours = await this.requireHours(placeId);
    if (hours.length === 0) {
      return { openNow: null };
    }
    const clock = readDamascusClock(now);
    const today = hours.filter((hour) => hour.dayOfWeek === clock.dayOfWeek);
    return { openNow: isOpenAt(today, clock.minutes) };
  }

  /**
   * Weekly hours for every place that has them. Ramadan hours appear only inside a stored season.
   */
  async readWeek(placeId: string, now: Date = new Date()): Promise<HoursWeekResult> {
    await this.placeService.getPublicPlace(placeId);
    const regular = await this.placeHourRepository.listByPlace(placeId, 'regular');
    const inSeason = await this.placeHourRepository.isRamadan(now);
    const ramadanRows = inSeason
      ? await this.placeHourRepository.listByPlace(placeId, 'ramadan')
      : [];
    return {
      week: buildWeek(regular),
      ramadan: buildWeek(ramadanRows),
    };
  }

  /**
   * Regular week for the owner editor. Ramadan rows stay out, and a day keeps at most three periods.
   */
  async readRegularWeek(placeId: string): Promise<HoursWeekResult['week']> {
    const regular = await this.placeHourRepository.listByPlace(placeId, 'regular');
    const week = buildWeek(regular);
    if (!week) {
      return null;
    }
    return week.map((day) => ({
      dayOfWeek: day.dayOfWeek,
      periods: day.periods.slice(0, PERIODS_PER_DAY_LIMIT),
    }));
  }

  /**
   * Replaces the regular week. Ramadan rows are left in place.
   */
  async replaceRegularWeek(
    placeId: string,
    week: Array<{ dayOfWeek: number; periods: Array<{ opensAt: number; closesAt: number }> }>,
  ): Promise<void> {
    const periods = assertValidWeek(week);
    await this.placeHourRepository.replaceRegular(placeId, periods);
  }

  /**
   * Staff write for a regular or Ramadan week. Nothing is sent for review.
   */
  async replaceSeasonWeek(
    placeId: string,
    season: HourSeasonName,
    week: Array<{ dayOfWeek: number; periods: Array<{ opensAt: number; closesAt: number }> }>,
  ): Promise<void> {
    const periods = assertValidWeek(week);
    const saved = await this.placeHourRepository.replaceSeason(placeId, season, periods);
    if (!saved) {
      throw new ResourceNotFoundException('Place', placeId);
    }
  }

  private async requireHours(placeId: string): Promise<PlaceHourEntity[]> {
    await this.placeService.getPublicPlace(placeId);
    return this.placeHourRepository.listByPlace(placeId, 'regular');
  }
}

function buildWeek(hours: PlaceHourEntity[]): HoursWeekResult['week'] {
  if (hours.length === 0) {
    return null;
  }
  return Array.from({ length: WEEK_LENGTH }, (_, dayOfWeek) => ({
    dayOfWeek,
    periods: hours
      .filter((hour) => hour.dayOfWeek === dayOfWeek)
      .map((hour) => ({ opensAt: hour.opensAt, closesAt: hour.closesAt })),
  }));
}

const MINUTES_PER_DAY = 24 * 60;

export function assertValidWeek(
  week: Array<{ dayOfWeek: number; periods: Array<{ opensAt: number; closesAt: number }> }>,
): RegularHourPeriod[] {
  if (week.length !== WEEK_LENGTH) {
    throw new InvalidStateException({ message: 'Hours are invalid', code: 'hours_invalid' });
  }
  const seen = new Set<number>();
  const periods: RegularHourPeriod[] = [];
  for (const day of week) {
    if (day.dayOfWeek < 0 || day.dayOfWeek > 6 || seen.has(day.dayOfWeek)) {
      throw new InvalidStateException({ message: 'Hours are invalid', code: 'hours_invalid' });
    }
    seen.add(day.dayOfWeek);
    if (day.periods.length > PERIODS_PER_DAY_LIMIT) {
      throw new InvalidStateException({ message: 'Hours are invalid', code: 'hours_invalid' });
    }
    const ordered = [...day.periods].sort((left, right) => left.opensAt - right.opensAt);
    let previousClose = -1;
    for (const period of ordered) {
      const overlaps = period.opensAt < previousClose;
      const outOfRange =
        period.opensAt < 0 ||
        period.closesAt > MINUTES_PER_DAY ||
        period.opensAt >= period.closesAt;
      if (overlaps || outOfRange) {
        throw new InvalidStateException({ message: 'Hours are invalid', code: 'hours_invalid' });
      }
      previousClose = period.closesAt;
      periods.push({
        dayOfWeek: day.dayOfWeek,
        opensAt: period.opensAt,
        closesAt: period.closesAt,
      });
    }
  }
  return periods;
}
