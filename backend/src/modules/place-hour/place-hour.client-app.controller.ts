import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { OpenNowResponseDto } from '@/modules/place-hour/dto/response/open-now-response.dto';
import { PlaceHoursResponseDto } from '@/modules/place-hour/dto/response/place-hours-response.dto';
import { PlaceHourService } from '@/modules/place-hour/place-hour.service';

@ApiTags('places')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/places')
export class PlaceHourClientAppController {
  constructor(private readonly placeHourService: PlaceHourService) {}

  @PublicRoute()
  @Get(':id/open-now')
  async readOpenNow(@Param('id') id: string): Promise<OpenNowResponseDto> {
    const result = await this.placeHourService.readOpenNow(id);
    return new OpenNowResponseDto(result);
  }

  @PublicRoute()
  @Get(':id/hours')
  async readHours(@Param('id') id: string): Promise<PlaceHoursResponseDto> {
    const result = await this.placeHourService.readWeek(id);
    return new PlaceHoursResponseDto(result);
  }
}
