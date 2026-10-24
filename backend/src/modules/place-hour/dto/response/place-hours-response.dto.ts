import { ApiProperty } from '@nestjs/swagger';

import { HoursWeekResult } from '@/modules/place-hour/place-hour.service';

class HourPeriodResponseDto {
  @ApiProperty()
  readonly opensAt: number;

  @ApiProperty()
  readonly closesAt: number;

  constructor(period: { opensAt: number; closesAt: number }) {
    this.opensAt = period.opensAt;
    this.closesAt = period.closesAt;
  }
}

class HourDayResponseDto {
  @ApiProperty()
  readonly dayOfWeek: number;

  @ApiProperty({ type: [HourPeriodResponseDto] })
  readonly periods: HourPeriodResponseDto[];

  constructor(day: { dayOfWeek: number; periods: Array<{ opensAt: number; closesAt: number }> }) {
    this.dayOfWeek = day.dayOfWeek;
    this.periods = day.periods.map((period) => new HourPeriodResponseDto(period));
  }
}

export class PlaceHoursResponseDto {
  @ApiProperty({ type: [HourDayResponseDto], nullable: true })
  readonly week: HourDayResponseDto[] | null;

  constructor(result: HoursWeekResult) {
    this.week = result.week ? result.week.map((day) => new HourDayResponseDto(day)) : null;
  }
}
