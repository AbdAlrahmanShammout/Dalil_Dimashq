import { Body, Controller, Get, HttpCode, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from '@/authentication/auth.service';
import { ChangePasswordRequestDto } from '@/authentication/dto/request/change-password-request.dto';
import { ForgotPasswordRequestDto } from '@/authentication/dto/request/forgot-password-request.dto';
import { RefreshSessionRequestDto } from '@/authentication/dto/request/refresh-session-request.dto';
import { ResetPasswordRequestDto } from '@/authentication/dto/request/reset-password-request.dto';
import { SignInRequestDto } from '@/authentication/dto/request/sign-in-request.dto';
import { SignUpRequestDto } from '@/authentication/dto/request/sign-up-request.dto';
import { VerifyEmailRequestDto } from '@/authentication/dto/request/verify-email-request.dto';
import { AuthSessionResponseDto } from '@/authentication/dto/response/auth-session-response.dto';
import { ChangePasswordResponseDto } from '@/authentication/dto/response/change-password-response.dto';
import { DashboardOwnerMeResponseDto } from '@/authentication/dto/response/dashboard-owner-me-response.dto';
import { ForgotPasswordResponseDto } from '@/authentication/dto/response/forgot-password-response.dto';
import { ResetPasswordResponseDto } from '@/authentication/dto/response/reset-password-response.dto';
import { SignOutResponseDto } from '@/authentication/dto/response/sign-out-response.dto';
import { SignUpResponseDto } from '@/authentication/dto/response/sign-up-response.dto';
import { VerifyEmailResponseDto } from '@/authentication/dto/response/verify-email-response.dto';
import { ForgetPasswordService } from '@/authentication/forget-password.service';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { AUTH_THROTTLE } from '@/common/constants/auth-throttle';
import { AuthDoor } from '@/modules/user/enum/general.enum';

@ApiTags('auth')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/auth')
export class AuthDashboardOwnerController {
  constructor(
    private readonly authService: AuthService,
    private readonly forgetPasswordService: ForgetPasswordService,
  ) {}

  @PublicRoute()
  @Throttle(AUTH_THROTTLE)
  @Post('sign-up')
  async signUp(@Body() body: SignUpRequestDto): Promise<SignUpResponseDto> {
    const { email, password } = body;
    const result = await this.authService.signUp({
      email,
      password,
      door: AuthDoor.Owner,
      audience: ApiAudience.DashboardOwner,
    });
    return new SignUpResponseDto(result);
  }

  @PublicRoute()
  @Throttle(AUTH_THROTTLE)
  @HttpCode(200)
  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyEmailRequestDto): Promise<VerifyEmailResponseDto> {
    const { email, code } = body;
    await this.authService.verifyEmail({ email, code, audience: ApiAudience.DashboardOwner });
    return new VerifyEmailResponseDto();
  }

  @PublicRoute()
  @Throttle(AUTH_THROTTLE)
  @HttpCode(200)
  @Post('sign-in')
  async signIn(@Body() body: SignInRequestDto): Promise<AuthSessionResponseDto> {
    const { email, password } = body;
    const session = await this.authService.signIn({
      email,
      password,
      door: AuthDoor.Owner,
      audience: ApiAudience.DashboardOwner,
    });
    return new AuthSessionResponseDto(session);
  }

  @PublicRoute()
  @Throttle(AUTH_THROTTLE)
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() body: RefreshSessionRequestDto): Promise<AuthSessionResponseDto> {
    const { refreshToken } = body;
    const session = await this.authService.refresh({
      refreshToken,
      audience: ApiAudience.DashboardOwner,
    });
    return new AuthSessionResponseDto(session);
  }

  @PublicRoute()
  @Throttle(AUTH_THROTTLE)
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto> {
    const { email } = body;
    const result = await this.forgetPasswordService.requestReset({
      email,
      audience: ApiAudience.DashboardOwner,
      door: AuthDoor.Owner,
    });
    return new ForgotPasswordResponseDto(result);
  }

  @PublicRoute()
  @Throttle(AUTH_THROTTLE)
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    const { email, code, password } = body;
    await this.forgetPasswordService.resetPassword({
      email,
      code,
      password,
      audience: ApiAudience.DashboardOwner,
      door: AuthDoor.Owner,
    });
    return new ResetPasswordResponseDto();
  }

  @HttpCode(200)
  @Post('sign-out')
  async signOut(@LoggedInUser() currentUser: Principal): Promise<SignOutResponseDto> {
    await this.authService.signOut({ userId: currentUser.id, audience: currentUser.audience });
    return new SignOutResponseDto();
  }

  @Get('me')
  async me(@LoggedInUser() currentUser: Principal): Promise<DashboardOwnerMeResponseDto> {
    const user = await this.authService.requireUser(currentUser.id);
    return new DashboardOwnerMeResponseDto(user);
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
