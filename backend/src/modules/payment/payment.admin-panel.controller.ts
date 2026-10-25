import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_SALES } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { RecordPaymentRequestDto } from '@/modules/payment/dto/request/record-payment-request.dto';
import { PaymentResponseDto } from '@/modules/payment/dto/response/payment-response.dto';
import { PaymentService } from '@/modules/payment/payment.service';

@ApiTags('payments')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_SALES)
@Controller('admin-panel/payments')
export class PaymentAdminPanelController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async record(@Body() body: RecordPaymentRequestDto): Promise<PaymentResponseDto> {
    const { placeId, amount, currency, method, item, payer, periodStart, periodEnd } = body;
    const recorded = await this.paymentService.record({
      placeId,
      amount,
      currency,
      method,
      item,
      payer,
      periodStart: periodStart ? new Date(periodStart) : null,
      periodEnd: periodEnd ? new Date(periodEnd) : null,
    });
    return new PaymentResponseDto(recorded);
  }
}
