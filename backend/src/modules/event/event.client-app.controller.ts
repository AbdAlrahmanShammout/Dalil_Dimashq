import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { OfferListQueryDto } from '@/modules/offer/dto/request/offer-list-query.dto';
import {
  EventListResponseDto,
  EventResponseDto,
} from '@/modules/event/dto/response/event-response.dto';
import { EventService } from '@/modules/event/event.service';

@ApiTags('events')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/events')
export class EventClientAppController {
  constructor(private readonly eventService: EventService) {}

  @PublicRoute()
  @Get()
  async listEvents(@Query() query: OfferListQueryDto): Promise<EventListResponseDto> {
    const { limit, offset } = query;
    const page = await this.eventService.listPublished({ limit, offset });
    return new EventListResponseDto(page);
  }

  @PublicRoute()
  @Get(':id')
  async getEvent(@Param('id') id: string): Promise<EventResponseDto> {
    const event = await this.eventService.getPublished(id);
    return new EventResponseDto(event);
  }
}
