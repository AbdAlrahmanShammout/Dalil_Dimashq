import { Injectable } from '@nestjs/common';

import { PlaceService } from '@/modules/place/place.service';
import { isOpenAt, readDamascusClock } from '@/modules/place-hour/damascus-clock';
import { PlaceHourEntity } from '@/modules/place-hour/entity/place-hour.entity';
import { PlaceHourRepository } from '@/modules/place-hour/repository/place-hour.repository';

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
