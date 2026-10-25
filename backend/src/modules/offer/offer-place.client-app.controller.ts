import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { OfferListQueryDto } from '@/modules/offer/dto/request/offer-list-query.dto';
import { OfferListResponseDto } from '@/modules/offer/dto/response/offer-list-response.dto';
import { OfferService } from '@/modules/offer/offer.service';

@ApiTags('places')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/places')
export class OfferPlaceClientAppController {
  constructor(private readonly offerService: OfferService) {}

  @PublicRoute()
  @Get(':id/offers')
  async listPlaceOffers(
    @Param('id') id: string,
    @Query() query: OfferListQueryDto,
  ): Promise<OfferListResponseDto> {
    const { limit, offset } = query;
    const page = await this.offerService.listPlaceOffers(id, { limit, offset });
    return new OfferListResponseDto(page);
  }
}
