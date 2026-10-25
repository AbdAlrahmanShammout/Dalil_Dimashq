import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PaymentReceiptResponseDto } from '@/modules/payment/dto/response/payment-receipt-response.dto';
import { PaymentService } from '@/modules/payment/payment.service';
import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';

@ApiTags('payments')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/payments')
export class PaymentReceiptDashboardOwnerController {
  constructor(
    private readonly ownerPlaceService: OwnerPlaceService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get(':id/receipt')
  async receipt(
    @LoggedInUser() currentUser: Principal,
    @Param('id') id: string,
  ): Promise<PaymentReceiptResponseDto> {
    const payment = await this.paymentService.readReceipt(id);
    await this.ownerPlaceService.assertLinked(currentUser.id, payment.placeId);
    return new PaymentReceiptResponseDto(payment);
  }
}
