import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { AreaService } from '@/modules/area/area.service';
import { AreaResponseDto } from '@/modules/area/dto/response/area-response.dto';

@ApiTags('areas')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/areas')
export class AreaClientAppController {
  constructor(private readonly areaService: AreaService) {}

  @PublicRoute()
  @Get()
  async listAreas(): Promise<AreaResponseDto[]> {
    const areas = await this.areaService.listAreas();
    return areas.map((area) => new AreaResponseDto(area));
  }
}
