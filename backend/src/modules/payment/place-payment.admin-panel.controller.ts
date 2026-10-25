import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_SALES } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PaymentHistoryResponseDto } from '@/modules/payment/dto/response/payment-history-response.dto';
import { PaymentService } from '@/modules/payment/payment.service';

@ApiTags('payments')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_SALES)
@Controller('admin-panel/places')
export class PlacePaymentAdminPanelController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get(':id/payments')
  async list(@Param('id') placeId: string): Promise<PaymentHistoryResponseDto> {
    const payments = await this.paymentService.listForPlace(placeId);
    return new PaymentHistoryResponseDto(payments);
  }
}
