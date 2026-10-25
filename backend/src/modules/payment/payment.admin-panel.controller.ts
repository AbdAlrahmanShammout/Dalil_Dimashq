import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { STAFF_ROLE_SALES } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { RecordPaymentRequestDto } from '@/modules/payment/dto/request/record-payment-request.dto';
import { VoidPaymentRequestDto } from '@/modules/payment/dto/request/void-payment-request.dto';
import { PaymentReceiptResponseDto } from '@/modules/payment/dto/response/payment-receipt-response.dto';
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

  @Post(':id/void')
  async voidPayment(
    @LoggedInUser() currentUser: Principal,
    @Param('id') id: string,
    @Body() body: VoidPaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentService.voidPayment(
      id,
      body.reason,
      new Date(),
      currentUser.id,
    );
    return new PaymentResponseDto(payment);
  }

  @Get(':id/receipt')
  async receipt(@Param('id') id: string): Promise<PaymentReceiptResponseDto> {
    const payment = await this.paymentService.readReceipt(id);
    return new PaymentReceiptResponseDto(payment);
  }
}
