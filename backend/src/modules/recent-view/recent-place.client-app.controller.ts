import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { RecentPlaceListResponseDto } from '@/modules/recent-view/dto/response/recent-place-list-response.dto';
import { RecentPlaceService } from '@/modules/recent-view/recent-place.service';

@ApiTags('recent-places')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/recent-places')
export class RecentPlaceClientAppController {
  constructor(private readonly recentPlaceService: RecentPlaceService) {}

  @Get()
  async list(@LoggedInUser() currentUser: Principal): Promise<RecentPlaceListResponseDto> {
    const places = await this.recentPlaceService.list(currentUser.id);
    return new RecentPlaceListResponseDto(places);
  }

  @Post(':placeId')
  async record(
    @LoggedInUser() currentUser: Principal,
    @Param('placeId') placeId: string,
  ): Promise<RecentPlaceListResponseDto> {
    await this.recentPlaceService.record(currentUser.id, placeId);
    const places = await this.recentPlaceService.list(currentUser.id);
    return new RecentPlaceListResponseDto(places);
  }
}
