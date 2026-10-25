import { ApiProperty } from '@nestjs/swagger';

export class OwnerLinkResponseDto {
  @ApiProperty()
  readonly linked: true;

  constructor() {
    this.linked = true;
  }
}
