import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { ContactMessageListResponseDto } from '@/modules/contact/dto/response/contact-message-list-response.dto';
import { ContactMessageService } from '@/modules/contact/contact-message.service';

@ApiTags('contact-messages')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/contact-messages')
export class ContactMessageAdminPanelController {
  constructor(private readonly contactMessageService: ContactMessageService) {}

  @Get()
  async list(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<ContactMessageListResponseDto> {
    const page = await this.contactMessageService.list({
      limit: readPageNumber(limit),
      offset: readPageNumber(offset),
    });
    return new ContactMessageListResponseDto(page);
  }
}

function readPageNumber(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
}
