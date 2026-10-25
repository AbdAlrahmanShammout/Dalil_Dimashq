import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { OwnerBookingListResponseDto } from '@/modules/booking/dto/response/owner-booking-list-response.dto';
import { RejectBookingRequestDto } from '@/modules/booking/dto/request/reject-booking-request.dto';
import { CancelBookingRequestDto } from '@/modules/booking/dto/request/cancel-booking-request.dto';
import { AttendanceRequestDto } from '@/modules/booking/dto/request/attendance-request.dto';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
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

  @Post(':id/bookings/:bookingId/confirm')
  async confirm(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('bookingId') bookingId: string,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.ownerBookingService.confirm(placeId, bookingId);
    return new PlaceAmenityChangedResponseDto();
  }

  @Post(':id/bookings/:bookingId/reject')
  async reject(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('bookingId') bookingId: string,
    @Body() body: RejectBookingRequestDto,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.ownerBookingService.reject(placeId, bookingId, body.reason ?? null);
    return new PlaceAmenityChangedResponseDto();
  }

  @Post(':id/bookings/:bookingId/cancel')
  async cancel(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('bookingId') bookingId: string,
    @Body() body: CancelBookingRequestDto,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.ownerBookingService.cancel(placeId, bookingId, body.reason);
    return new PlaceAmenityChangedResponseDto();
  }

  @Post(':id/bookings/:bookingId/attendance')
  async attendance(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('bookingId') bookingId: string,
    @Body() body: AttendanceRequestDto,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.ownerBookingService.markAttendance(placeId, bookingId, body.result ?? null);
    return new PlaceAmenityChangedResponseDto();
  }
}
