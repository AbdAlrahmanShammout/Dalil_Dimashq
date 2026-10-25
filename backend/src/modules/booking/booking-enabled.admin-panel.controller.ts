import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR, STAFF_ROLE_SALES } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { SetBookingEnabledRequestDto } from '@/modules/booking/dto/request/set-booking-enabled-request.dto';
import { OwnerBookingSettingsService } from '@/modules/booking/owner-booking-settings.service';

@ApiTags('bookings')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR, STAFF_ROLE_SALES)
@Controller('admin-panel/places')
export class BookingEnabledAdminPanelController {
  constructor(private readonly ownerBookingSettingsService: OwnerBookingSettingsService) {}

  @Post(':id/booking-enabled')
  @HttpCode(200)
  async setEnabled(
    @Param('id') placeId: string,
    @Body() body: SetBookingEnabledRequestDto,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerBookingSettingsService.setEnabled(placeId, body.enabled);
    return new PlaceAmenityChangedResponseDto();
  }
}
