import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { DecideProfileChangeRequestDto } from '@/modules/user/dto/request/decide-profile-change-request.dto';
import { ProfileDecisionResponseDto } from '@/modules/user/dto/response/profile-decision-response.dto';
import { UserService } from '@/modules/user/user.service';

@ApiTags('profile-change-requests')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/profile-change-requests')
export class ProfileChangeAdminPanelController {
  constructor(private readonly userService: UserService) {}

  @Post(':id/decide')
  async decide(
    @Param('id') id: string,
    @Body() body: DecideProfileChangeRequestDto,
  ): Promise<ProfileDecisionResponseDto> {
    const saved = await this.userService.decideProfileChange({ id, decision: body.decision });
    return new ProfileDecisionResponseDto(saved.id, saved.status);
  }
}
