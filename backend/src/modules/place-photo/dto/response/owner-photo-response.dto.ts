import { ApiProperty } from '@nestjs/swagger';

export class OwnerPhotoResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly objectKey: string;

  constructor(photo: { id: string; objectKey: string }) {
    this.id = photo.id;
    this.objectKey = photo.objectKey;
  }
}
