import { ApiProperty } from '@nestjs/swagger';

export class FakeBookingReportResponseDto {
  @ApiProperty()
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
