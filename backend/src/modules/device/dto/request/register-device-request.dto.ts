import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

import { DEVICE_PLATFORMS } from '@/modules/device/repository/device.repository';

export class RegisterDeviceRequestDto {
  @ApiProperty({ enum: DEVICE_PLATFORMS })
  @IsIn(DEVICE_PLATFORMS)
  platform!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(4096)
  token!: string;
}
