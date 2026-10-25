import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { OwnerBookingListResponseDto } from '@/modules/booking/dto/response/owner-booking-list-response.dto';
import { OwnerBookingService } from '@/modules/booking/owner-booking.service';
import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';

@ApiTags('owner-bookings')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/places')
export class OwnerBookingDashboardController {
  constructor(
    private readonly ownerPlaceService: OwnerPlaceService,
    private readonly ownerBookingService: OwnerBookingService,
  ) {}

  @Get(':id/bookings')
  async list(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
  ): Promise<OwnerBookingListResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    const rows = await this.ownerBookingService.listForPlace(placeId);
    return new OwnerBookingListResponseDto(rows);
  }
}
