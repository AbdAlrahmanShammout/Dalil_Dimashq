import { ApiProperty } from '@nestjs/swagger';

export class PhoneVerifiedResponseDto {
  @ApiProperty()
  readonly verified: true;

  constructor() {
    this.verified = true;
  }
}
