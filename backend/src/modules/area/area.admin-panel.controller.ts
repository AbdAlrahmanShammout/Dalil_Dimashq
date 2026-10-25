import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { SaveAreaRequestDto } from '@/modules/area/dto/request/save-area-request.dto';
import { AreaResponseDto } from '@/modules/area/dto/response/area-response.dto';
import { AreaService } from '@/modules/area/area.service';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';

@ApiTags('areas')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/areas')
export class AreaAdminPanelController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  async create(@Body() body: SaveAreaRequestDto): Promise<AreaResponseDto> {
    const { nameAr, nameEn } = body;
    const area = await this.areaService.createArea({ nameAr, nameEn });
    return new AreaResponseDto(area);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: SaveAreaRequestDto,
  ): Promise<AreaResponseDto> {
    const { nameAr, nameEn } = body;
    const area = await this.areaService.updateArea(id, { nameAr, nameEn });
    return new AreaResponseDto(area);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PlaceAmenityChangedResponseDto> {
    await this.areaService.deleteArea(id);
    return new PlaceAmenityChangedResponseDto();
  }
}
