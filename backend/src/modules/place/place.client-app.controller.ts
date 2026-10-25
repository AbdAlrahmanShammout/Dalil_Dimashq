import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { PlaceCountsResponseDto } from '@/modules/place/dto/response/place-counts-response.dto';
import { PlaceSummaryResponseDto } from '@/modules/place/dto/response/place-summary-response.dto';
import { PlaceService } from '@/modules/place/place.service';
import { SearchPlacesQueryDto } from '@/modules/search/dto/request/search-places-query.dto';
import { MapPlacesQueryDto } from '@/modules/search/dto/request/map-places-query.dto';
import { PlaceSearchResponseDto } from '@/modules/search/dto/response/place-search-response.dto';
import { MapPointResponseDto } from '@/modules/search/dto/response/map-point-response.dto';
import { SearchService } from '@/modules/search/search.service';

@ApiTags('places')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/places')
export class PlaceClientAppController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly searchService: SearchService,
  ) {}

  @PublicRoute()
  @Get('counts')
  async countPlaces(): Promise<PlaceCountsResponseDto> {
    const counts = await this.placeService.countPublicPlaces();
    return new PlaceCountsResponseDto(counts);
  }

  @PublicRoute()
  @Get('featured')
  async listFeatured(): Promise<PlaceSummaryResponseDto[]> {
    const places = await this.placeService.listFeaturedPlaces();
    return places.map((place) => new PlaceSummaryResponseDto(place));
  }

  @PublicRoute()
  @Get('map')
  async listMap(@Query() query: MapPlacesQueryDto): Promise<MapPointResponseDto[]> {
    const { text, type, areaId, minimumStars, hasPhone, sort, latitude, longitude } = query;
    const points = await this.searchService.listMapPoints({
      text,
      type,
      areaId,
      minimumStars,
      hasPhone,
      sort,
      latitude,
      longitude,
    });
    return points.map((point) => new MapPointResponseDto(point));
  }

  @PublicRoute()
  @Get()
  async searchPlaces(@Query() query: SearchPlacesQueryDto): Promise<PlaceSearchResponseDto> {
    const { text, type, areaId, minimumStars, hasPhone, sort, limit, offset } = query;
    const page = await this.searchService.searchPlaces({
      text,
      type,
      areaId,
      minimumStars,
      hasPhone,
      sort,
      limit,
      offset,
    });
    return new PlaceSearchResponseDto(page);
  }

  @PublicRoute()
  @Get(':id')
  async getPlace(@Param('id') id: string): Promise<PlaceSummaryResponseDto> {
    const place = await this.placeService.getPublicPlace(id);
    return new PlaceSummaryResponseDto(place);
  }
}
