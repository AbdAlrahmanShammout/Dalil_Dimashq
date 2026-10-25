import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { BookingAvailabilityService } from '@/modules/booking/booking-availability.service';
import { BookingAvailabilityResponseDto } from '@/modules/booking/dto/response/booking-availability-response.dto';

@ApiTags('bookings')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/places/:id/booking-availability')
export class BookingAvailabilityClientAppController {
  constructor(private readonly bookingAvailabilityService: BookingAvailabilityService) {}

  @PublicRoute()
  @Get()
  async read(@Param('id') placeId: string): Promise<BookingAvailabilityResponseDto> {
    const availability = await this.bookingAvailabilityService.read(placeId);
    return new BookingAvailabilityResponseDto(availability);
  }
}
