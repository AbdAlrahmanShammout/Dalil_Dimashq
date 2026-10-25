import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_MODERATOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { NoShowWatchResponseDto } from '@/modules/booking/dto/response/no-show-watch-response.dto';
import { OwnerBookingService } from '@/modules/booking/owner-booking.service';

@ApiTags('no-show-watch')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_MODERATOR)
@Controller('admin-panel/no-show-watch')
export class NoShowWatchAdminPanelController {
  constructor(private readonly ownerBookingService: OwnerBookingService) {}

  @Get()
  async list(): Promise<NoShowWatchResponseDto> {
    const customers = await this.ownerBookingService.listNoShowWatch();
    return new NoShowWatchResponseDto(customers);
  }
}
