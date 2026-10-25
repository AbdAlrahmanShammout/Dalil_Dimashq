import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReportPlaceRequestDto {
  @ApiProperty()
  @IsString()
  reason!: string;
}
