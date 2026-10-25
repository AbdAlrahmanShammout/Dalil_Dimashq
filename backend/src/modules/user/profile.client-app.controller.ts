import { Body, Controller, HttpCode, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { CompleteProfileRequestDto } from '@/modules/user/dto/request/complete-profile-request.dto';
import { UpdateProfileRequestDto } from '@/modules/user/dto/request/update-profile-request.dto';
import { CompleteProfileResponseDto } from '@/modules/user/dto/response/complete-profile-response.dto';
import { UserService } from '@/modules/user/user.service';

@ApiTags('profile')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/profile')
export class ProfileClientAppController {
  constructor(private readonly userService: UserService) {}

  @Post('complete')
  @HttpCode(200)
  async completeProfile(
    @LoggedInUser() currentUser: Principal,
    @Body() body: CompleteProfileRequestDto,
  ): Promise<CompleteProfileResponseDto> {
    const { firstName, lastName, phone, birthYear, language } = body;
    const user = await this.userService.completeProfile({
      userId: currentUser.id,
      firstName,
      lastName,
      phone,
      birthYear,
      language,
    });
    return new CompleteProfileResponseDto(user);
  }

  @Patch()
  @HttpCode(200)
  async updateProfile(
    @LoggedInUser() currentUser: Principal,
    @Body() body: UpdateProfileRequestDto,
  ): Promise<CompleteProfileResponseDto> {
    const { phone, language } = body;
    const user = await this.userService.updateProfileContact({
      userId: currentUser.id,
      phone,
      language,
    });
    return new CompleteProfileResponseDto(user);
  }
}
