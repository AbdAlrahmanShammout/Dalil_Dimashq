import { ApiProperty } from '@nestjs/swagger';

export class ProfileDecisionResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly status: 'approved' | 'rejected';

  constructor(id: string, status: 'approved' | 'rejected') {
    this.id = id;
    this.status = status;
  }
}
