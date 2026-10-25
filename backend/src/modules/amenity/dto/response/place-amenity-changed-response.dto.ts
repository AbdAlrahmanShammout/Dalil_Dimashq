import { ApiProperty } from '@nestjs/swagger';

export class PlaceAmenityChangedResponseDto {
  @ApiProperty()
  readonly changed: true;

  constructor() {
    this.changed = true;
  }
}
