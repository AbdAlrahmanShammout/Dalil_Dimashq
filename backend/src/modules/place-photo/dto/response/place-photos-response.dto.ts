import { ApiProperty } from '@nestjs/swagger';

import { PlacePhotoRole } from '@/modules/place-photo/entity/place-photo.entity';
import { PlacePhotosResult, PlacePhotoView } from '@/modules/place-photo/place-photo.service';

class PlacePhotoItemResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly url: string;

  @ApiProperty({ enum: PlacePhotoRole })
  readonly role: PlacePhotoRole;

  constructor(photo: PlacePhotoView) {
    this.id = photo.id;
    this.url = photo.url;
    this.role = photo.role;
  }
}

export class PlacePhotosResponseDto {
  @ApiProperty({ type: [PlacePhotoItemResponseDto] })
  readonly photos: PlacePhotoItemResponseDto[];

  @ApiProperty({ nullable: true })
  readonly coverUrl: string | null;

  @ApiProperty({ nullable: true })
  readonly logoUrl: string | null;

  constructor(result: PlacePhotosResult) {
    this.photos = result.photos.map((photo) => new PlacePhotoItemResponseDto(photo));
    this.coverUrl = result.coverUrl;
    this.logoUrl = result.logoUrl;
  }
}
