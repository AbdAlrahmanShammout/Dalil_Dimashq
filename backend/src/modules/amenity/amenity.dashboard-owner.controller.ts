import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { AmenityService } from '@/modules/amenity/amenity.service';
import { AmenityCatalogResponseDto } from '@/modules/amenity/dto/response/amenity-catalog-response.dto';

@ApiTags('amenities')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/amenities')
export class AmenityDashboardOwnerController {
  constructor(private readonly amenityService: AmenityService) {}

  @Get()
  async list(): Promise<AmenityCatalogResponseDto> {
    const amenities = await this.amenityService.listCatalog();
    return new AmenityCatalogResponseDto(amenities);
  }
}
