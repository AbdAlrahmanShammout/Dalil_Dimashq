import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { OwnerBookingListResponseDto } from '@/modules/booking/dto/response/owner-booking-list-response.dto';
import { RejectBookingRequestDto } from '@/modules/booking/dto/request/reject-booking-request.dto';
import { CancelBookingRequestDto } from '@/modules/booking/dto/request/cancel-booking-request.dto';
import { AttendanceRequestDto } from '@/modules/booking/dto/request/attendance-request.dto';
import { FakeBookingReportRequestDto } from '@/modules/booking/dto/request/fake-booking-report-request.dto';
import { FakeBookingReportResponseDto } from '@/modules/booking/dto/response/fake-booking-report-response.dto';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { SaveBookingSettingsRequestDto } from '@/modules/booking/dto/request/save-booking-settings-request.dto';
import { SaveResponseHourRequestDto } from '@/modules/booking/dto/request/save-response-hour-request.dto';
import { SaveBlackoutRequestDto } from '@/modules/booking/dto/request/save-blackout-request.dto';
import { OwnerBookingSettingsResponseDto } from '@/modules/booking/dto/response/owner-booking-settings-response.dto';
import { OwnerBookingSettingsService } from '@/modules/booking/owner-booking-settings.service';
import { OwnerBookingService } from '@/modules/booking/owner-booking.service';
import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';

@ApiTags('owner-bookings')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/places')
export class OwnerBookingDashboardController {
  constructor(
    private readonly ownerPlaceService: OwnerPlaceService,
    private readonly ownerBookingService: OwnerBookingService,
    private readonly ownerBookingSettingsService: OwnerBookingSettingsService,
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

  @Post(':id/bookings/:bookingId/fake-report')
  async reportFake(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('bookingId') bookingId: string,
    @Body() body: FakeBookingReportRequestDto,
  ): Promise<FakeBookingReportResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    const created = await this.ownerBookingService.reportFake({
      userId: currentUser.id,
      placeId,
      bookingId,
      reason: body.reason,
    });
    return new FakeBookingReportResponseDto(created.id);
  }

  @Get(':id/booking-settings')
  async readSettings(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
  ): Promise<OwnerBookingSettingsResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    const settings = await this.ownerBookingSettingsService.read(placeId);
    return new OwnerBookingSettingsResponseDto(settings);
  }

  @Put(':id/booking-settings')
  async saveSettings(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Body() body: SaveBookingSettingsRequestDto,
  ): Promise<OwnerBookingSettingsResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    const { acceptsBookings, maxParty, noticeMinutes } = body;
    const settings = await this.ownerBookingSettingsService.save({
      placeId,
      acceptsBookings,
      maxParty,
      noticeMinutes: noticeMinutes ?? null,
    });
    return new OwnerBookingSettingsResponseDto(settings);
  }

  @Post(':id/response-hours')
  async addResponseHour(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Body() body: SaveResponseHourRequestDto,
  ): Promise<FakeBookingReportResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.ownerPlaceService.assertPremium(placeId);
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
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('hourId') hourId: string,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.ownerPlaceService.assertPremium(placeId);
    await this.ownerBookingSettingsService.removeResponseHour(placeId, hourId);
    return new PlaceAmenityChangedResponseDto();
  }

  @Post(':id/blackouts')
  async addBlackout(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Body() body: SaveBlackoutRequestDto,
  ): Promise<FakeBookingReportResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.ownerPlaceService.assertPremium(placeId);
    const created = await this.ownerBookingSettingsService.addBlackout({
      placeId,
      startsAt: new Date(body.startsAt),
      endsAt: new Date(body.endsAt),
    });
    return new FakeBookingReportResponseDto(created.id);
  }

  @Delete(':id/blackouts/:blackoutId')
  async removeBlackout(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('blackoutId') blackoutId: string,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.ownerPlaceService.assertPremium(placeId);
    await this.ownerBookingSettingsService.removeBlackout(placeId, blackoutId);
    return new PlaceAmenityChangedResponseDto();
  }
}
