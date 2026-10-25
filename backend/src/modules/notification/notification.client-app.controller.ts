import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { NotificationListResponseDto } from '@/modules/notification/dto/response/notification-list-response.dto';
import { NotificationReadResponseDto } from '@/modules/notification/dto/response/notification-read-response.dto';
import { NotificationService } from '@/modules/notification/notification.service';

@ApiTags('notifications')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/notifications')
export class NotificationClientAppController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async list(@LoggedInUser() currentUser: Principal): Promise<NotificationListResponseDto> {
    const rows = await this.notificationService.listMine(currentUser.id);
    return new NotificationListResponseDto(rows);
  }

  @Post(':id/read')
  async markRead(
    @LoggedInUser() currentUser: Principal,
    @Param('id') notificationId: string,
  ): Promise<NotificationReadResponseDto> {
    const row = await this.notificationService.markRead(currentUser.id, notificationId);
    return new NotificationReadResponseDto(row);
  }
}
