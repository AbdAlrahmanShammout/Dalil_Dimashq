import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class SaveBlackoutRequestDto {
  @ApiProperty()
  @IsDateString()
  startsAt!: string;

  @ApiProperty()
  @IsDateString()
  endsAt!: string;
}
