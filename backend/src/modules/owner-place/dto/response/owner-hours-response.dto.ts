import { ApiProperty } from '@nestjs/swagger';

class OwnerHourPeriodDto {
  @ApiProperty()
  readonly opensAt: number;

  @ApiProperty()
  readonly closesAt: number;

  constructor(period: { opensAt: number; closesAt: number }) {
    this.opensAt = period.opensAt;
    this.closesAt = period.closesAt;
  }
}

class OwnerHourDayDto {
  @ApiProperty()
  readonly dayOfWeek: number;

  @ApiProperty({ type: [OwnerHourPeriodDto] })
  readonly periods: OwnerHourPeriodDto[];

  constructor(day: { dayOfWeek: number; periods: Array<{ opensAt: number; closesAt: number }> }) {
    this.dayOfWeek = day.dayOfWeek;
    this.periods = day.periods.map((period) => new OwnerHourPeriodDto(period));
  }
}

export class OwnerHoursResponseDto {
  @ApiProperty({ type: [OwnerHourDayDto], nullable: true })
  readonly week: OwnerHourDayDto[] | null;

  constructor(
    week: Array<{
      dayOfWeek: number;
      periods: Array<{ opensAt: number; closesAt: number }>;
    }> | null,
  ) {
    this.week = week ? week.map((day) => new OwnerHourDayDto(day)) : null;
  }
}
