import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class SaveResponseHourRequestDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  opensAt!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  closesAt!: number;
}
