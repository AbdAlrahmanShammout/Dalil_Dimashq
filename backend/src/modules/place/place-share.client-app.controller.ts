import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { PlaceShareResponseDto } from '@/modules/place/dto/response/place-share-response.dto';
import { PlaceShareService } from '@/modules/place/place-share.service';

@ApiTags('places')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/places')
export class PlaceShareClientAppController {
  constructor(private readonly placeShareService: PlaceShareService) {}

  @PublicRoute()
  @Get(':id/share')
  async readShare(@Param('id') id: string): Promise<PlaceShareResponseDto> {
    const share = await this.placeShareService.readShare(id);
    return new PlaceShareResponseDto(share);
  }
}
