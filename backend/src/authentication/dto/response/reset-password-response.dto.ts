import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResponseDto {
  @ApiProperty({ example: true })
  reset: boolean;

  constructor() {
    this.reset = true;
  }
}
