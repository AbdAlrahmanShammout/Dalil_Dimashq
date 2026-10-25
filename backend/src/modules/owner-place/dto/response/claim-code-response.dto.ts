import { ApiProperty } from '@nestjs/swagger';

export class ClaimCodeResponseDto {
  @ApiProperty()
  readonly linked: true;

  constructor() {
    this.linked = true;
  }
}
