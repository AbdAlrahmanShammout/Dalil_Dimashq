import { ApiProperty } from '@nestjs/swagger';

export class PhoneCodeResponseDto {
  @ApiProperty()
  readonly sent: false;

  constructor() {
    this.sent = false;
  }
}
