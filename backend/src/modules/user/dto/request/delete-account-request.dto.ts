import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class DeleteAccountRequestDto {
  @ApiProperty({ example: 'Password123' })
  @IsString()
  @MinLength(1)
  password!: string;
}
