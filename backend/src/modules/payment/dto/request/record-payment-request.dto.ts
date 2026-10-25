import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

import { PAYMENT_METHODS } from '@/modules/payment/repository/payment.repository';

export class RecordPaymentRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  placeId!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  amount!: number;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  currency!: string;

  @ApiProperty({ enum: PAYMENT_METHODS })
  @IsIn(PAYMENT_METHODS)
  method!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  item!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  payer!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  periodEnd?: string;
}
