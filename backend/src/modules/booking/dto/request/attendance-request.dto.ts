import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AttendanceRequestDto {
  @ApiPropertyOptional({ enum: ['attended', 'no_show'] })
  @IsOptional()
  @IsString()
  result?: string;
}
