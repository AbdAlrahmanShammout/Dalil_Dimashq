import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { CreateBookingRequestDto } from '@/modules/booking/dto/request/create-booking-request.dto';
import { CreateBookingResponseDto } from '@/modules/booking/dto/response/create-booking-response.dto';
import { BookingService } from '@/modules/booking/booking.service';

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
    const { clientKey, placeId, startsAt, partySize, note } = body;
    const booking = await this.bookingService.create({
      clientKey,
      userId: currentUser.id,
      placeId,
      startsAt: new Date(startsAt),
      partySize,
      note: note ?? null,
    });
    return new CreateBookingResponseDto(booking);
  }
}
