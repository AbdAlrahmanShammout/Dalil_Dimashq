import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import {
  FeaturePlaceRequestDto,
  UpdateFeaturedRequestDto,
} from '@/modules/place/dto/request/feature-place-request.dto';
import { StaffPlaceService } from '@/modules/place/staff-place.service';

@ApiTags('featured')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/featured')
export class FeaturedAdminPanelController {
  constructor(private readonly staffPlaceService: StaffPlaceService) {}

  @Post()
  async add(@Body() body: FeaturePlaceRequestDto): Promise<PlaceAmenityChangedResponseDto> {
    await this.staffPlaceService.setFeatured(body.placeId, true);
    return new PlaceAmenityChangedResponseDto();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateFeaturedRequestDto,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.staffPlaceService.setFeatured(id, body.featured);
    return new PlaceAmenityChangedResponseDto();
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PlaceAmenityChangedResponseDto> {
    await this.staffPlaceService.setFeatured(id, false);
    return new PlaceAmenityChangedResponseDto();
  }
}
