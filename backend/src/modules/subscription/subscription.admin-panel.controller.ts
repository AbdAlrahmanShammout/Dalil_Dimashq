import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_SALES } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import {
  CreateSubscriptionRequestDto,
  UpdateSubscriptionRequestDto,
} from '@/modules/subscription/dto/request/save-subscription-request.dto';
import { SubscriptionResponseDto } from '@/modules/subscription/dto/response/subscription-response.dto';
import { SubscriptionService } from '@/modules/subscription/subscription.service';

@ApiTags('subscriptions')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_SALES)
@Controller('admin-panel/subscriptions')
export class SubscriptionAdminPanelController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() body: CreateSubscriptionRequestDto): Promise<SubscriptionResponseDto> {
    const { placeId, endsAt } = body;
    const created = await this.subscriptionService.create({ placeId, endsAt: new Date(endsAt) });
    return new SubscriptionResponseDto(created);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateSubscriptionRequestDto,
  ): Promise<SubscriptionResponseDto> {
    const updated = await this.subscriptionService.update(id, new Date(body.endsAt));
    return new SubscriptionResponseDto(updated);
  }
}
