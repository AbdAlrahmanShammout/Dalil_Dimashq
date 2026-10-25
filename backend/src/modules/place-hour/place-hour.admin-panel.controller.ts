import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { SaveStaffHoursRequestDto } from '@/modules/place-hour/dto/request/save-staff-hours-request.dto';
import { PlaceHourService } from '@/modules/place-hour/place-hour.service';

@ApiTags('place-hours')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/places')
export class PlaceHourAdminPanelController {
  constructor(private readonly placeHourService: PlaceHourService) {}

  @Put(':id/hours')
  @HttpCode(200)
  async save(
    @Param('id') placeId: string,
    @Body() body: SaveStaffHoursRequestDto,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.placeHourService.replaceSeasonWeek(placeId, body.season, body.week);
    return new PlaceAmenityChangedResponseDto();
  }
}
