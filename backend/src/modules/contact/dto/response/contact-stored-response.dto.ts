import { ApiProperty } from '@nestjs/swagger';

export class ContactStoredResponseDto {
  @ApiProperty()
  readonly id: string;

  constructor(input: { id: string }) {
    this.id = input.id;
  }
}
