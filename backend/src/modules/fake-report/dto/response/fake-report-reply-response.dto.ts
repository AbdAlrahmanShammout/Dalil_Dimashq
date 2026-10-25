import { ApiProperty } from '@nestjs/swagger';

export class FakeReportReplyResponseDto {
  @ApiProperty()
  readonly id: string;

  constructor(input: { id: string }) {
    this.id = input.id;
  }
}
