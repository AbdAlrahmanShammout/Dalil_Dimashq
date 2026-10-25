import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ClaimCodeRequestDto {
  @ApiProperty({ example: 'DD-1001' })
  @IsString()
  @MinLength(1)
  code!: string;
}
