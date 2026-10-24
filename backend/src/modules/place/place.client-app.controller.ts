import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { PlaceCountsResponseDto } from '@/modules/place/dto/response/place-counts-response.dto';
import { PlaceSummaryResponseDto } from '@/modules/place/dto/response/place-summary-response.dto';
import { PlaceService } from '@/modules/place/place.service';

@ApiTags('places')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/places')
export class PlaceClientAppController {
  constructor(private readonly placeService: PlaceService) {}

  @PublicRoute()
  @Get('counts')
  async countPlaces(): Promise<PlaceCountsResponseDto> {
    const counts = await this.placeService.countPublicPlaces();
    return new PlaceCountsResponseDto(counts);
  }

  @PublicRoute()
  @Get(':id')
  async getPlace(@Param('id') id: string): Promise<PlaceSummaryResponseDto> {
    const place = await this.placeService.getPublicPlace(id);
    return new PlaceSummaryResponseDto(place);
  }
}
