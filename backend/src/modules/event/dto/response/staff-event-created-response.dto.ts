import { ApiProperty } from '@nestjs/swagger';

export class StaffEventCreatedResponseDto {
  @ApiProperty()
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
