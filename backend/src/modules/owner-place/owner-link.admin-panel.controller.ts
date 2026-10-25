import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { LinkOwnerRequestDto } from '@/modules/owner-place/dto/request/link-owner-request.dto';
import { OwnerLinkListResponseDto } from '@/modules/owner-place/dto/response/owner-link-list-response.dto';
import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';

@ApiTags('owners')
@Audience(ApiAudience.AdminPanel)
@Controller('admin-panel')
export class OwnerLinkAdminPanelController {
  constructor(private readonly ownerPlaceService: OwnerPlaceService) {}

  @Roles(STAFF_ROLE_EDITOR)
  @Post('places/:id/owners')
  async link(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Body() body: LinkOwnerRequestDto,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.linkForStaff(placeId, body.userId, currentUser.id);
    return new PlaceAmenityChangedResponseDto();
  }

  @Roles(STAFF_ROLE_EDITOR)
  @Delete('places/:id/owners/:userId')
  async unlink(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('userId') userId: string,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.unlinkForStaff(placeId, userId, currentUser.id);
    return new PlaceAmenityChangedResponseDto();
  }

  @Get('owners')
  async list(): Promise<OwnerLinkListResponseDto> {
    const links = await this.ownerPlaceService.listLinks();
    return new OwnerLinkListResponseDto(links);
  }
}
