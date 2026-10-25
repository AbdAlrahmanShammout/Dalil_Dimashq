import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { DeviceService } from '@/modules/device/device.service';
import { RegisterDeviceRequestDto } from '@/modules/device/dto/request/register-device-request.dto';
import { RegisterDeviceResponseDto } from '@/modules/device/dto/response/register-device-response.dto';
import { DevicePlatformName } from '@/modules/device/repository/device.repository';

@ApiTags('devices')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/devices')
export class DeviceDashboardOwnerController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  async register(
    @LoggedInUser() currentUser: Principal,
    @Body() body: RegisterDeviceRequestDto,
  ): Promise<RegisterDeviceResponseDto> {
    const { platform, token } = body;
    const stored = await this.deviceService.register({
      userId: currentUser.id,
      audience: currentUser.audience,
      platform: platform as DevicePlatformName,
      token,
    });
    return new RegisterDeviceResponseDto(stored);
  }
}
