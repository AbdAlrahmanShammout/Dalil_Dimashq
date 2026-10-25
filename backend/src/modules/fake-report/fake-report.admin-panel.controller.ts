import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_MODERATOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { DecideFakeReportRequestDto } from '@/modules/fake-report/dto/request/decide-fake-report-request.dto';
import { FakeReportService } from '@/modules/fake-report/fake-report.service';

@ApiTags('fake-reports')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_MODERATOR)
@Controller('admin-panel/fake-reports')
export class FakeReportAdminPanelController {
  constructor(private readonly fakeReportService: FakeReportService) {}

  @Post(':id/decide')
  @HttpCode(200)
  async decide(
    @Param('id') id: string,
    @Body() body: DecideFakeReportRequestDto,
  ): Promise<PlaceAmenityChangedResponseDto> {
    const { decision, note, badFaith } = body;
    await this.fakeReportService.decide({ id, decision, note, badFaith });
    return new PlaceAmenityChangedResponseDto();
  }
}
