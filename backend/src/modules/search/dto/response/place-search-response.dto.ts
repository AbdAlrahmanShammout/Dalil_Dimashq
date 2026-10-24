import { ApiProperty } from '@nestjs/swagger';

import { PlaceSummaryResponseDto } from '@/modules/place/dto/response/place-summary-response.dto';
import { PlaceSearchPage } from '@/modules/search/repository/search.repository';

export class PlaceSearchResponseDto {
  @ApiProperty({ type: [PlaceSummaryResponseDto] })
  readonly items: PlaceSummaryResponseDto[];

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly offset: number;

  constructor(page: PlaceSearchPage) {
    this.items = page.items.map((place) => new PlaceSummaryResponseDto(place));
    this.total = page.total;
    this.limit = page.limit;
    this.offset = page.offset;
  }
}
