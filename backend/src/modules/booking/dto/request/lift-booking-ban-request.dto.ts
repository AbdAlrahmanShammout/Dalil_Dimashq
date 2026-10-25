import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LiftBookingBanRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  note!: string;
}
