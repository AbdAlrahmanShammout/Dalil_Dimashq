import { ApiProperty } from '@nestjs/swagger';

export class PlaceCodeResponseDto {
  @ApiProperty()
  readonly code: string;

  constructor(code: string) {
    this.code = code;
  }
}
