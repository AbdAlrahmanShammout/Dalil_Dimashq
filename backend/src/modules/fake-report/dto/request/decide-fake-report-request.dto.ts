import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsString, MinLength } from 'class-validator';

export class DecideFakeReportRequestDto {
  @ApiProperty({ enum: ['confirmed', 'rejected'] })
  @IsIn(['confirmed', 'rejected'])
  decision!: 'confirmed' | 'rejected';

  @ApiProperty()
  @IsString()
  @MinLength(1)
  note!: string;

  @ApiProperty()
  @IsBoolean()
  badFaith!: boolean;
}
