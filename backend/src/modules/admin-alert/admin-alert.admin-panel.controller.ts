import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { AdminAlertService } from '@/modules/admin-alert/admin-alert.service';
import { AdminAlertListResponseDto } from '@/modules/admin-alert/dto/response/admin-alert-list-response.dto';

@ApiTags('alerts')
@Audience(ApiAudience.AdminPanel)
@Controller('admin-panel/alerts')
export class AdminAlertAdminPanelController {
  constructor(private readonly adminAlertService: AdminAlertService) {}

  @Get()
  async list(): Promise<AdminAlertListResponseDto> {
    const alerts = await this.adminAlertService.listUnread();
    return new AdminAlertListResponseDto(alerts);
  }

  @Post(':id/read')
  @HttpCode(200)
  async markRead(@Param('id') id: string): Promise<PlaceAmenityChangedResponseDto> {
    await this.adminAlertService.markRead(id);
    return new PlaceAmenityChangedResponseDto();
  }
}
