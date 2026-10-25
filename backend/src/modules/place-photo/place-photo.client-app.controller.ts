import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { PlacePhotosResponseDto } from '@/modules/place-photo/dto/response/place-photos-response.dto';
import { PlacePhotoService } from '@/modules/place-photo/place-photo.service';

@ApiTags('places')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/places')
export class PlacePhotoClientAppController {
  constructor(private readonly placePhotoService: PlacePhotoService) {}

  @PublicRoute()
  @Get(':id/photos')
  async listPhotos(@Param('id') id: string): Promise<PlacePhotosResponseDto> {
    const result = await this.placePhotoService.listPhotos(id);
    return new PlacePhotosResponseDto(result);
  }
}
