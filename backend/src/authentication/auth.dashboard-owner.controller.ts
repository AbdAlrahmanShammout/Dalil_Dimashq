import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { ForgotPasswordRequestDto } from '@/authentication/dto/request/forgot-password-request.dto';
import { ResetPasswordRequestDto } from '@/authentication/dto/request/reset-password-request.dto';
import { ForgotPasswordResponseDto } from '@/authentication/dto/response/forgot-password-response.dto';
import { ResetPasswordResponseDto } from '@/authentication/dto/response/reset-password-response.dto';
import { ForgetPasswordService } from '@/authentication/forget-password.service';
import { ApiAudience } from '@/common/auth/principal.interface';
import { AUTH_THROTTLE } from '@/common/constants/auth-throttle';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { AuthDoor } from '@/modules/user/enum/general.enum';

@ApiTags('auth')
@Controller('dashboard-owner/auth')
export class AuthDashboardOwnerController {
  constructor(private readonly forgetPasswordService: ForgetPasswordService) {}

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
}
