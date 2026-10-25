import { ApiProperty } from '@nestjs/swagger';

export class StaffPlaceCreatedResponseDto {
  @ApiProperty()
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
