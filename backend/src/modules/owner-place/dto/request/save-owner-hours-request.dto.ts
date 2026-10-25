import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, Max, Min, ValidateNested } from 'class-validator';

class SaveHourPeriodDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(24 * 60)
  opensAt!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(24 * 60)
  closesAt!: number;
}

class SaveHourDayDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @ApiProperty({ type: [SaveHourPeriodDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveHourPeriodDto)
  periods!: SaveHourPeriodDto[];
}

export class SaveOwnerHoursRequestDto {
  @ApiProperty({ type: [SaveHourDayDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveHourDayDto)
  week!: SaveHourDayDto[];
}
