import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleSignInRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  idToken!: string;
}
