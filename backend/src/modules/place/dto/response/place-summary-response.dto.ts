import { ApiProperty } from '@nestjs/swagger';

import { AreaResponseDto } from '@/modules/area/dto/response/area-response.dto';
import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceStatus, PlaceType, resolvePhotoFallback } from '@/modules/place/enum/general.enum';

export class PlaceSummaryResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly nameAr: string;

  @ApiProperty()
  readonly nameEn: string;

  @ApiProperty({ enum: PlaceType })
  readonly type: PlaceType;

  @ApiProperty({ enum: PlaceStatus })
  readonly status: PlaceStatus;

  @ApiProperty({ type: AreaResponseDto })
  readonly area: AreaResponseDto;

  @ApiProperty({ nullable: true })
  readonly addressAr: string | null;

  @ApiProperty({ nullable: true })
  readonly addressEn: string | null;

  @ApiProperty({ nullable: true })
  readonly latitude: number | null;

  @ApiProperty({ nullable: true })
  readonly longitude: number | null;

  @ApiProperty()
  readonly featured: boolean;

  @ApiProperty({ nullable: true })
  readonly starLabel: number | null;

  @ApiProperty({ nullable: true })
  readonly starSource: string | null;

  @ApiProperty()
  readonly photoFallback: string;

  constructor(place: PlaceEntity) {
    if (!place.area) {
      throw new Error('Place summary requires an area');
    }
    this.id = place.id;
    this.nameAr = place.nameAr;
    this.nameEn = place.nameEn;
    this.type = place.type;
    this.status = place.status;
    this.area = new AreaResponseDto(place.area);
    this.addressAr = place.addressAr;
    this.addressEn = place.addressEn;
    this.latitude = place.latitude;
    this.longitude = place.longitude;
    this.featured = place.isFeatured;
    this.starLabel = place.starValue;
    this.starSource = place.starSource;
    this.photoFallback = resolvePhotoFallback(place.type);
  }
}
