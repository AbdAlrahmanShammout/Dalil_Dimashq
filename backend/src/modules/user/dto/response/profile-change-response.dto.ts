import { ApiProperty } from '@nestjs/swagger';

export class ProfileChangeResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly status: 'pending';

  constructor(input: { readonly id: string }) {
    this.id = input.id;
    this.status = 'pending';
  }
}
