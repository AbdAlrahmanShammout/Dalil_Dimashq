import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { DecideChangeRequestDto } from '@/modules/change-request/dto/request/decide-change-request.dto';
import { PlaceChangeResponseDto } from '@/modules/change-request/dto/response/place-change-response.dto';
import { PlaceChangeService } from '@/modules/change-request/place-change.service';

@ApiTags('change-requests')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/change-requests')
export class ChangeRequestAdminPanelController {
  constructor(private readonly placeChangeService: PlaceChangeService) {}

  @Post(':id/decide')
  async decide(
    @Param('id') id: string,
    @Body() body: DecideChangeRequestDto,
  ): Promise<PlaceChangeResponseDto> {
    const { decision, note } = body;
    const saved = await this.placeChangeService.decide({ id, decision, note });
    return new PlaceChangeResponseDto(saved);
  }
}
