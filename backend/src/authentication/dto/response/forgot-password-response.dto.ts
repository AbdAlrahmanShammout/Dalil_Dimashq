import { ApiProperty } from '@nestjs/swagger';

import { FORGOT_PASSWORD_CODE } from '@/authentication/forget-password.service';

export class ForgotPasswordResponseDto {
  @ApiProperty({ example: FORGOT_PASSWORD_CODE })
  code: typeof FORGOT_PASSWORD_CODE;

  constructor(data: { code: typeof FORGOT_PASSWORD_CODE }) {
    this.code = data.code;
  }
}
