import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { AmenityAdminResponseDto } from '@/modules/amenity/dto/response/amenity-admin-response.dto';
import { SaveAmenityRequestDto } from '@/modules/amenity/dto/request/save-amenity-request.dto';
import { AmenityService } from '@/modules/amenity/amenity.service';

@ApiTags('amenities')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/amenities')
export class AmenityAdminPanelController {
  constructor(private readonly amenityService: AmenityService) {}

  @Post()
  async create(@Body() body: SaveAmenityRequestDto): Promise<AmenityAdminResponseDto> {
    const { code, nameAr, nameEn, sortOrder } = body;
    const item = await this.amenityService.createAmenity({ code, nameAr, nameEn, sortOrder });
    return new AmenityAdminResponseDto(item);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: SaveAmenityRequestDto,
  ): Promise<AmenityAdminResponseDto> {
    const { code, nameAr, nameEn, sortOrder } = body;
    const item = await this.amenityService.updateAmenity(id, { code, nameAr, nameEn, sortOrder });
    return new AmenityAdminResponseDto(item);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PlaceAmenityChangedResponseDto> {
    await this.amenityService.deleteAmenity(id);
    return new PlaceAmenityChangedResponseDto();
  }
}
