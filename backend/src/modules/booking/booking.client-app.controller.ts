import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { BookingService } from '@/modules/booking/booking.service';
import { CreateBookingRequestDto } from '@/modules/booking/dto/request/create-booking-request.dto';
import { BookingDetailResponseDto } from '@/modules/booking/dto/response/booking-detail-response.dto';
import { BookingListResponseDto } from '@/modules/booking/dto/response/booking-list-response.dto';
import { CreateBookingResponseDto } from '@/modules/booking/dto/response/create-booking-response.dto';
import { BOOKING_PAGE_LIMIT } from '@/modules/booking/repository/booking.repository';

class BookingListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}

@ApiTags('bookings')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/bookings')
export class BookingClientAppController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(
    @LoggedInUser() currentUser: Principal,
    @Body() body: CreateBookingRequestDto,
  ): Promise<CreateBookingResponseDto> {
    const { clientKey, placeId, startsAt, partySize, note, offerId } = body;
    const booking = await this.bookingService.create({
      clientKey,
      userId: currentUser.id,
      placeId,
      startsAt: new Date(startsAt),
      partySize,
      note: note ?? null,
      requestedOfferId: offerId,
    });
    return new CreateBookingResponseDto(booking);
  }

  @Get()
  async list(
    @LoggedInUser() currentUser: Principal,
    @Query() query: BookingListQueryDto,
  ): Promise<BookingListResponseDto> {
    const limit = query.limit ?? BOOKING_PAGE_LIMIT;
    const offset = query.offset ?? 0;
    const page = await this.bookingService.listMine({ userId: currentUser.id, limit, offset });
    return new BookingListResponseDto({ ...page, limit, offset });
  }

  @Get(':id')
  async read(
    @LoggedInUser() currentUser: Principal,
    @Param('id') bookingId: string,
  ): Promise<BookingDetailResponseDto> {
    const booking = await this.bookingService.readMine(currentUser.id, bookingId);
    return new BookingDetailResponseDto(booking);
  }
}
