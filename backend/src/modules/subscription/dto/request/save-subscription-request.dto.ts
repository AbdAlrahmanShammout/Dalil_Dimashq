import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, MinLength } from 'class-validator';

export class CreateSubscriptionRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  placeId!: string;

  @ApiProperty()
  @IsDateString()
  endsAt!: string;
}

export class UpdateSubscriptionRequestDto {
  @ApiProperty()
  @IsDateString()
  endsAt!: string;
}
