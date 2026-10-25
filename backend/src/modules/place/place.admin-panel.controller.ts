import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { SaveStaffPlaceRequestDto } from '@/modules/place/dto/request/save-staff-place-request.dto';
import { PlaceCodeResponseDto } from '@/modules/place/dto/response/place-code-response.dto';
import { StaffPlaceCreatedResponseDto } from '@/modules/place/dto/response/staff-place-created-response.dto';
import { StaffPlaceService } from '@/modules/place/staff-place.service';
import { StaffPlaceWrite } from '@/modules/place/repository/place.repository';

@ApiTags('places')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/places')
export class PlaceAdminPanelController {
  constructor(private readonly staffPlaceService: StaffPlaceService) {}

  @Post()
  async create(@Body() body: SaveStaffPlaceRequestDto): Promise<StaffPlaceCreatedResponseDto> {
    const created = await this.staffPlaceService.create(toWrite(body));
    return new StaffPlaceCreatedResponseDto(created.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: SaveStaffPlaceRequestDto,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.staffPlaceService.update(id, toWrite(body));
    return new PlaceAmenityChangedResponseDto();
  }

  @Get(':id/code')
  async readCode(@Param('id') id: string): Promise<PlaceCodeResponseDto> {
    const code = await this.staffPlaceService.readCode(id);
    return new PlaceCodeResponseDto(code);
  }

  @Post(':id/renew-code')
  async renewCode(@Param('id') id: string): Promise<PlaceCodeResponseDto> {
    const code = await this.staffPlaceService.renewCode(id);
    return new PlaceCodeResponseDto(code);
  }
}

function toWrite(body: SaveStaffPlaceRequestDto): StaffPlaceWrite {
  const { nameAr, nameEn, type, status, areaId } = body;
  return {
    nameAr,
    nameEn,
    type,
    status,
    areaId,
    addressAr: emptyToNull(body.addressAr),
    addressEn: emptyToNull(body.addressEn),
    phone: emptyToNull(body.phone),
    website: emptyToNull(body.website),
    email: emptyToNull(body.email),
    facebook: emptyToNull(body.facebook),
    instagram: emptyToNull(body.instagram),
    descriptionAr: emptyToNull(body.descriptionAr),
    descriptionEn: emptyToNull(body.descriptionEn),
  };
}

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
}
