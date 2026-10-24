import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordResponseDto {
  @ApiProperty({ example: true })
  changed: boolean;

  constructor() {
    this.changed = true;
  }
}
