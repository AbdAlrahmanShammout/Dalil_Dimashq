import { ApiProperty } from '@nestjs/swagger';

import { AuthSession } from '@/authentication/auth.service';

export class AuthSessionResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ example: 900 })
  expiresIn: number;

  constructor(session: AuthSession) {
    this.accessToken = session.accessToken;
    this.refreshToken = session.refreshToken;
    this.expiresIn = session.expiresIn;
  }
}
