import { Body, Controller, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { SaveSiteContactsRequestDto } from '@/modules/contact/dto/request/save-site-contacts-request.dto';
import { SiteContactsResponseDto } from '@/modules/contact/dto/response/site-contacts-response.dto';
import { SiteContactService } from '@/modules/contact/site-contact.service';

@ApiTags('site-contacts')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/site-contacts')
export class SiteContactAdminPanelController {
  constructor(private readonly siteContactService: SiteContactService) {}

  @Put()
  async save(
    @LoggedInUser() currentUser: Principal,
    @Body() body: SaveSiteContactsRequestDto,
  ): Promise<SiteContactsResponseDto> {
    const { whatsapp, phone, email, facebook, instagram } = body;
    const saved = await this.siteContactService.saveShortcuts(
      { whatsapp, phone, email, facebook, instagram },
      currentUser.id,
    );
    return new SiteContactsResponseDto(saved);
  }
}
