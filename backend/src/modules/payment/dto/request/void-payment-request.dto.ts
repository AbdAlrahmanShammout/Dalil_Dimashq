import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class VoidPaymentRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  reason!: string;
}
