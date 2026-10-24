import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { DeleteAccountRequestDto } from '@/modules/user/dto/request/delete-account-request.dto';
import { DeleteAccountResponseDto } from '@/modules/user/dto/response/delete-account-response.dto';
import { AuthDoor } from '@/modules/user/enum/general.enum';
import { UserService } from '@/modules/user/user.service';

@ApiTags('account')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/account')
export class AccountDashboardOwnerController {
  constructor(private readonly userService: UserService) {}

  @Post('delete')
  @HttpCode(200)
  async deleteAccount(
    @LoggedInUser() currentUser: Principal,
    @Body() body: DeleteAccountRequestDto,
  ): Promise<DeleteAccountResponseDto> {
    const { password } = body;
    const result = await this.userService.deleteDoor({
      userId: currentUser.id,
      door: AuthDoor.Owner,
      password,
      audience: ApiAudience.DashboardOwner,
    });
    return new DeleteAccountResponseDto(result);
  }
}
