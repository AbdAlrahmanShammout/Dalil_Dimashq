import { ApiProperty } from '@nestjs/swagger';

import { OpenNowResult } from '@/modules/place-hour/place-hour.service';

export class OpenNowResponseDto {
  @ApiProperty({ nullable: true })
  readonly openNow: boolean | null;

  constructor(result: OpenNowResult) {
    this.openNow = result.openNow;
  }
}
