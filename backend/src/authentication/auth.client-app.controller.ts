import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from '@/authentication/auth.service';
import { GoogleSignInRequestDto } from '@/authentication/dto/request/google-sign-in-request.dto';
import { RefreshSessionRequestDto } from '@/authentication/dto/request/refresh-session-request.dto';
import { SignInRequestDto } from '@/authentication/dto/request/sign-in-request.dto';
import { SignUpRequestDto } from '@/authentication/dto/request/sign-up-request.dto';
import { VerifyEmailRequestDto } from '@/authentication/dto/request/verify-email-request.dto';
import { AuthSessionResponseDto } from '@/authentication/dto/response/auth-session-response.dto';
import { SignUpResponseDto } from '@/authentication/dto/response/sign-up-response.dto';
import { VerifyEmailResponseDto } from '@/authentication/dto/response/verify-email-response.dto';
import { ApiAudience } from '@/common/auth/principal.interface';
import { AUTH_THROTTLE } from '@/common/constants/auth-throttle';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { AuthDoor } from '@/modules/user/enum/general.enum';

@ApiTags('auth')
@Controller('client-app/auth')
export class AuthClientAppController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Throttle(AUTH_THROTTLE)
  @Post('sign-up')
  async signUp(@Body() body: SignUpRequestDto): Promise<SignUpResponseDto> {
    const { email, password } = body;
    const result = await this.authService.signUp({
      email,
      password,
      door: AuthDoor.Visitor,
      audience: ApiAudience.ClientApp,
    });
    return new SignUpResponseDto(result);
  }

  @PublicRoute()
  @Throttle(AUTH_THROTTLE)
  @HttpCode(200)
  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyEmailRequestDto): Promise<VerifyEmailResponseDto> {
    const { email, code } = body;
    await this.authService.verifyEmail({ email, code, audience: ApiAudience.ClientApp });
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
      door: AuthDoor.Visitor,
      audience: ApiAudience.ClientApp,
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
      audience: ApiAudience.ClientApp,
    });
    return new AuthSessionResponseDto(session);
  }

  @PublicRoute()
  @Throttle(AUTH_THROTTLE)
  @HttpCode(200)
  @Post('google')
  async google(@Body() body: GoogleSignInRequestDto): Promise<AuthSessionResponseDto> {
    const { idToken } = body;
    const session = await this.authService.signInWithGoogle(idToken);
    return new AuthSessionResponseDto(session);
  }
}
