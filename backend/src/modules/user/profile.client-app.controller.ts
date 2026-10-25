import { Body, Controller, Get, HttpCode, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { CompleteProfileRequestDto } from '@/modules/user/dto/request/complete-profile-request.dto';
import { ProfileChangeRequestDto } from '@/modules/user/dto/request/profile-change-request.dto';
import { UpdateProfileRequestDto } from '@/modules/user/dto/request/update-profile-request.dto';
import { VerifyPhoneRequestDto } from '@/modules/user/dto/request/verify-phone-request.dto';
import { CompleteProfileResponseDto } from '@/modules/user/dto/response/complete-profile-response.dto';
import { PhoneCodeResponseDto } from '@/modules/user/dto/response/phone-code-response.dto';
import { PhoneVerifiedResponseDto } from '@/modules/user/dto/response/phone-verified-response.dto';
import { ProfileChangeResponseDto } from '@/modules/user/dto/response/profile-change-response.dto';
import { VisitorProfileResponseDto } from '@/modules/user/dto/response/visitor-profile-response.dto';
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

  @Post('change-requests')
  @HttpCode(201)
  async requestChange(
    @LoggedInUser() currentUser: Principal,
    @Body() body: ProfileChangeRequestDto,
  ): Promise<ProfileChangeResponseDto> {
    const { firstName, lastName, birthYear } = body;
    const created = await this.userService.requestProfileChange({
      userId: currentUser.id,
      firstName,
      lastName,
      birthYear,
    });
    return new ProfileChangeResponseDto(created);
  }

  @Get()
  async readProfile(@LoggedInUser() currentUser: Principal): Promise<VisitorProfileResponseDto> {
    const profile = await this.userService.readProfile(currentUser.id);
    return new VisitorProfileResponseDto(profile);
  }

  @Post('phone/code')
  @HttpCode(200)
  async requestPhoneCode(@LoggedInUser() currentUser: Principal): Promise<PhoneCodeResponseDto> {
    await this.userService.requestPhoneCode(currentUser.id);
    return new PhoneCodeResponseDto();
  }

  @Post('phone/verify')
  @HttpCode(200)
  async verifyPhone(
    @LoggedInUser() currentUser: Principal,
    @Body() body: VerifyPhoneRequestDto,
  ): Promise<PhoneVerifiedResponseDto> {
    const { code } = body;
    await this.userService.verifyPhone(currentUser.id, code);
    return new PhoneVerifiedResponseDto();
  }
}
