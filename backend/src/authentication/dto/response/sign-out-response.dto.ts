import { ApiProperty } from '@nestjs/swagger';

export class SignOutResponseDto {
  @ApiProperty({ example: true })
  signedOut: boolean;

  constructor() {
    this.signedOut = true;
  }
}
