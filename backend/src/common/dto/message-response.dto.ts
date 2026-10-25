import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty()
  readonly code: string;

  constructor(code: string) {
    this.code = code;
  }
}
