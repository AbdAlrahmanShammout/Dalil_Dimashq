import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { NotificationListResponseDto } from '@/modules/notification/dto/response/notification-list-response.dto';
import { NotificationService } from '@/modules/notification/notification.service';

@ApiTags('notifications')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/notifications')
export class NotificationDashboardOwnerController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async list(@LoggedInUser() currentUser: Principal): Promise<NotificationListResponseDto> {
    const rows = await this.notificationService.listOwner(currentUser.id);
    return new NotificationListResponseDto(rows);
  }
}
