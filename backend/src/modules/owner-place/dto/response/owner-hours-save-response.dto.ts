import { ApiProperty } from '@nestjs/swagger';

export class OwnerHoursSaveResponseDto {
  @ApiProperty({ enum: ['saved', 'requested'] })
  readonly result: 'saved' | 'requested';

  constructor(result: 'saved' | 'requested') {
    this.result = result;
  }
}
