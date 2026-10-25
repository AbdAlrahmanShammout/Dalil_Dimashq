import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { UserContactsResponseDto } from '@/modules/user/dto/response/user-contacts-response.dto';
import { UserService } from '@/modules/user/user.service';

@ApiTags('users')
@Audience(ApiAudience.AdminPanel)
@Controller('admin-panel/users')
export class UserContactAdminPanelController {
  constructor(private readonly userService: UserService) {}

  @Get(':id/contacts')
  async read(@Param('id') id: string): Promise<UserContactsResponseDto> {
    const contacts = await this.userService.readContacts(id);
    return new UserContactsResponseDto(contacts);
  }
}
