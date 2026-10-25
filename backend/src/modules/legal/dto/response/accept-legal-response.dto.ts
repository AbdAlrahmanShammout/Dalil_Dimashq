import { ApiProperty } from '@nestjs/swagger';

export class AcceptLegalResponseDto {
  @ApiProperty()
  readonly accepted: true;

  constructor() {
    this.accepted = true;
  }
}
