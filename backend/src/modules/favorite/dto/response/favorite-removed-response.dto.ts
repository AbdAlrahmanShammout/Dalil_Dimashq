import { ApiProperty } from '@nestjs/swagger';

export class FavoriteRemovedResponseDto {
  @ApiProperty()
  readonly removed: boolean;

  constructor(removed: boolean) {
    this.removed = removed;
  }
}
