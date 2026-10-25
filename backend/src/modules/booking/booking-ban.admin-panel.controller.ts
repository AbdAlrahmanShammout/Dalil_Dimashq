import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_MODERATOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { BookingBanService } from '@/modules/booking/booking-ban.service';
import { LiftBookingBanRequestDto } from '@/modules/booking/dto/request/lift-booking-ban-request.dto';

@ApiTags('booking-bans')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_MODERATOR)
@Controller('admin-panel/booking-bans')
export class BookingBanAdminPanelController {
  constructor(private readonly bookingBanService: BookingBanService) {}

  @Post(':id/lift')
  @HttpCode(200)
  async lift(
    @Param('id') id: string,
    @Body() body: LiftBookingBanRequestDto,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.bookingBanService.lift(id, body.note);
    return new PlaceAmenityChangedResponseDto();
  }
}
