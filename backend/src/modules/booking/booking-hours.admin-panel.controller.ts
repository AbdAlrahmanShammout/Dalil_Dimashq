import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { OwnerBookingSettingsService } from '@/modules/booking/owner-booking-settings.service';
import { SaveBlackoutRequestDto } from '@/modules/booking/dto/request/save-blackout-request.dto';
import { SaveResponseHourRequestDto } from '@/modules/booking/dto/request/save-response-hour-request.dto';
import { FakeBookingReportResponseDto } from '@/modules/booking/dto/response/fake-booking-report-response.dto';

@ApiTags('booking-hours')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/places')
export class BookingHoursAdminPanelController {
  constructor(private readonly ownerBookingSettingsService: OwnerBookingSettingsService) {}

  @Post(':id/response-hours')
  async addResponseHour(
    @Param('id') placeId: string,
    @Body() body: SaveResponseHourRequestDto,
  ): Promise<FakeBookingReportResponseDto> {
    const { dayOfWeek, opensAt, closesAt } = body;
    const created = await this.ownerBookingSettingsService.addResponseHour({
      placeId,
      dayOfWeek,
      opensAt,
      closesAt,
    });
    return new FakeBookingReportResponseDto(created.id);
  }

  @Delete(':id/response-hours/:hourId')
  async removeResponseHour(
    @Param('id') placeId: string,
    @Param('hourId') hourId: string,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerBookingSettingsService.removeResponseHour(placeId, hourId);
    return new PlaceAmenityChangedResponseDto();
  }

  @Post(':id/blackouts')
  async addBlackout(
    @Param('id') placeId: string,
    @Body() body: SaveBlackoutRequestDto,
  ): Promise<FakeBookingReportResponseDto> {
    const created = await this.ownerBookingSettingsService.addBlackout({
      placeId,
      startsAt: new Date(body.startsAt),
      endsAt: new Date(body.endsAt),
    });
    return new FakeBookingReportResponseDto(created.id);
  }

  @Delete(':id/blackouts/:blackoutId')
  async removeBlackout(
    @Param('id') placeId: string,
    @Param('blackoutId') blackoutId: string,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerBookingSettingsService.removeBlackout(placeId, blackoutId);
    return new PlaceAmenityChangedResponseDto();
  }
}
