import { Body, Controller, Get, HttpCode, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from '@/authentication/auth.service';
import { ChangePasswordRequestDto } from '@/authentication/dto/request/change-password-request.dto';
import { SignInRequestDto } from '@/authentication/dto/request/sign-in-request.dto';
import { AdminPanelMeResponseDto } from '@/authentication/dto/response/admin-panel-me-response.dto';
import { AuthSessionResponseDto } from '@/authentication/dto/response/auth-session-response.dto';
import { ChangePasswordResponseDto } from '@/authentication/dto/response/change-password-response.dto';
import { SignOutResponseDto } from '@/authentication/dto/response/sign-out-response.dto';
import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { AUTH_THROTTLE } from '@/common/constants/auth-throttle';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';

@ApiTags('auth')
@Audience(ApiAudience.AdminPanel)
@Controller('admin-panel/auth')
export class AuthAdminPanelController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Throttle(AUTH_THROTTLE)
  @HttpCode(200)
  @Post('sign-in')
  async signIn(@Body() body: SignInRequestDto): Promise<AuthSessionResponseDto> {
    const { email, password } = body;
    const session = await this.authService.signInStaff({ email, password });
    return new AuthSessionResponseDto(session);
  }

  @HttpCode(200)
  @Post('sign-out')
  async signOut(@LoggedInUser() currentUser: Principal): Promise<SignOutResponseDto> {
    await this.authService.signOut({ userId: currentUser.id, audience: currentUser.audience });
    return new SignOutResponseDto();
  }

  @Get('me')
  async me(@LoggedInUser() currentUser: Principal): Promise<AdminPanelMeResponseDto> {
    const user = await this.authService.requireUser(currentUser.id);
    return new AdminPanelMeResponseDto(user);
  }

  @Patch('password')
  async changePassword(
    @LoggedInUser() currentUser: Principal,
    @Body() body: ChangePasswordRequestDto,
  ): Promise<ChangePasswordResponseDto> {
    const { currentPassword, newPassword } = body;
    await this.authService.changePassword({
      userId: currentUser.id,
      currentPassword,
      newPassword,
    });
    return new ChangePasswordResponseDto();
  }
}
