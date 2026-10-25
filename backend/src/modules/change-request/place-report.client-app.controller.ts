import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { ReportPlaceRequestDto } from '@/modules/change-request/dto/request/report-place-request.dto';
import { PlaceChangeResponseDto } from '@/modules/change-request/dto/response/place-change-response.dto';
import { PlaceChangeService } from '@/modules/change-request/place-change.service';

@ApiTags('reports')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/places')
export class PlaceReportClientAppController {
  constructor(private readonly placeChangeService: PlaceChangeService) {}

  @Post(':id/reports')
  async report(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Body() body: ReportPlaceRequestDto,
  ): Promise<PlaceChangeResponseDto> {
    const { reason } = body;
    const created = await this.placeChangeService.reportPlace({
      userId: currentUser.id,
      placeId,
      reason,
    });
    return new PlaceChangeResponseDto(created);
  }
}
