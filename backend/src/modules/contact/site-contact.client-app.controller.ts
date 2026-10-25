import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { SiteContactsResponseDto } from '@/modules/contact/dto/response/site-contacts-response.dto';
import { SiteContactService } from '@/modules/contact/site-contact.service';

@ApiTags('site-contacts')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/site-contacts')
export class SiteContactClientAppController {
  constructor(private readonly siteContactService: SiteContactService) {}

  @PublicRoute()
  @Get()
  async readShortcuts(): Promise<SiteContactsResponseDto> {
    const contacts = await this.siteContactService.readShortcuts();
    return new SiteContactsResponseDto(contacts);
  }
}
