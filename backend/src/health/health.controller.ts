import { Controller, Get } from '@nestjs/common';

import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { HealthResponseDto } from '@/health/dto/health-response.dto';
import { HealthService } from '@/health/health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @PublicRoute()
  @Get('live')
  getLive(): HealthResponseDto {
    return new HealthResponseDto();
  }

  @PublicRoute()
  @Get('ready')
  async getReady(): Promise<HealthResponseDto> {
    await this.healthService.assertReady();
    return new HealthResponseDto();
  }
}
