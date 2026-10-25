import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { BookingGateService } from '@/modules/booking/booking-gate.service';
import { OpenBookingRequestDto } from '@/modules/booking/dto/request/open-booking-request.dto';

@ApiTags('bookings')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/bookings')
export class BookingClientAppController {
  constructor(private readonly bookingGateService: BookingGateService) {}

  @Post()
  async open(
    @LoggedInUser() currentUser: Principal,
    @Body() body: OpenBookingRequestDto,
  ): Promise<MessageResponseDto> {
    const { placeId } = body;
    await this.bookingGateService.assertOpen({ userId: currentUser.id, placeId });
    return new MessageResponseDto('booking_open');
  }
}
