import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiProperty({ example: true })
  verified: boolean;

  constructor() {
    this.verified = true;
  }
}
