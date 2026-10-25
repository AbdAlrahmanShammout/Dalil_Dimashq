import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PanelSummaryResponseDto } from '@/modules/panel-summary/dto/response/panel-summary-response.dto';
import { PanelSummaryService } from '@/modules/panel-summary/panel-summary.service';

@ApiTags('summary')
@Audience(ApiAudience.AdminPanel)
@Controller('admin-panel/summary')
export class PanelSummaryAdminPanelController {
  constructor(private readonly panelSummaryService: PanelSummaryService) {}

  @Get()
  async read(): Promise<PanelSummaryResponseDto> {
    const summary = await this.panelSummaryService.read();
    return new PanelSummaryResponseDto(summary);
  }
}
