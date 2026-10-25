import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AmenityService } from '@/modules/amenity/amenity.service';
import { AmenityResponseDto } from '@/modules/amenity/dto/response/amenity-response.dto';
import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';

@ApiTags('places')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/places')
export class AmenityClientAppController {
  constructor(private readonly amenityService: AmenityService) {}

  @PublicRoute()
  @Get(':id/amenities')
  async listAmenities(@Param('id') id: string): Promise<AmenityResponseDto[]> {
    const amenities = await this.amenityService.listApproved(id);
    return amenities.map((amenity) => new AmenityResponseDto(amenity));
  }
}
