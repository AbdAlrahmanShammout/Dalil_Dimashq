import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PaymentHistoryResponseDto } from '@/modules/payment/dto/response/payment-history-response.dto';
import { PaymentService } from '@/modules/payment/payment.service';
import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';

@ApiTags('payments')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/places')
export class PlacePaymentDashboardOwnerController {
  constructor(
    private readonly ownerPlaceService: OwnerPlaceService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get(':id/payments')
  async list(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
  ): Promise<PaymentHistoryResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    const payments = await this.paymentService.listForPlace(placeId);
    return new PaymentHistoryResponseDto(payments);
  }
}
