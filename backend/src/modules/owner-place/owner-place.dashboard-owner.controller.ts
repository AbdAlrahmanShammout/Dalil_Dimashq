import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { OwnedPlaceListResponseDto } from '@/modules/owner-place/dto/response/owned-place-list-response.dto';
import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';

@ApiTags('owner-places')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/places')
export class OwnerPlaceDashboardController {
  constructor(private readonly ownerPlaceService: OwnerPlaceService) {}

  @Get()
  async list(@LoggedInUser() currentUser: Principal): Promise<OwnedPlaceListResponseDto> {
    const places = await this.ownerPlaceService.listMine(currentUser.id);
    return new OwnedPlaceListResponseDto(places);
  }
}
