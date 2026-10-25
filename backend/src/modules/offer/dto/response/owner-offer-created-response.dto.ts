import { ApiProperty } from '@nestjs/swagger';

export class OwnerOfferCreatedResponseDto {
  @ApiProperty()
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
