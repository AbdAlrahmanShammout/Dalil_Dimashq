import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyPhoneRequestDto {
  @ApiProperty({ example: '000000' })
  @IsString()
  @Length(6, 6)
  code!: string;
}
