import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({ enum: ['code_sent', 'ready'] })
  status: 'code_sent' | 'ready';

  constructor(data: { status: 'code_sent' | 'ready' }) {
    this.status = data.status;
  }
}
