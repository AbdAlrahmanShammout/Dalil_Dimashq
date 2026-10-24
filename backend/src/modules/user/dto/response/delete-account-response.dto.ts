import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountResponseDto {
  @ApiProperty()
  readonly removed: boolean;

  constructor(input: { readonly removed: boolean }) {
    this.removed = input.removed;
  }
}
