import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { ClaimCodeRequestDto } from '@/modules/owner-place/dto/request/claim-code-request.dto';
import { EditPlaceRequestDto } from '@/modules/owner-place/dto/request/edit-place-request.dto';
import { SaveOwnerHoursRequestDto } from '@/modules/owner-place/dto/request/save-owner-hours-request.dto';
import { ImmediatePlaceRequestDto } from '@/modules/owner-place/dto/request/immediate-place-request.dto';
import { OwnerPlaceSearchQueryDto } from '@/modules/owner-place/dto/request/owner-place-search-query.dto';
import { ClaimCodeResponseDto } from '@/modules/owner-place/dto/response/claim-code-response.dto';
import { ImmediatePlaceResponseDto } from '@/modules/owner-place/dto/response/immediate-place-response.dto';
import { OwnedPlaceListResponseDto } from '@/modules/owner-place/dto/response/owned-place-list-response.dto';
import { OwnerPlaceDetailResponseDto } from '@/modules/owner-place/dto/response/owner-place-detail-response.dto';
import { OwnerPlaceSearchResponseDto } from '@/modules/owner-place/dto/response/owner-place-search-response.dto';
import { OwnerHoursResponseDto } from '@/modules/owner-place/dto/response/owner-hours-response.dto';
import { OwnerHoursSaveResponseDto } from '@/modules/owner-place/dto/response/owner-hours-save-response.dto';
import { AmenityService } from '@/modules/amenity/amenity.service';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';
import { PlaceHourService, assertValidWeek } from '@/modules/place-hour/place-hour.service';
import { PlaceChangeService } from '@/modules/change-request/place-change.service';
import { PlaceChangeResponseDto } from '@/modules/change-request/dto/response/place-change-response.dto';
import { PlaceChangeListResponseDto } from '@/modules/change-request/dto/response/place-change-list-response.dto';

@ApiTags('owner-places')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/places')
export class OwnerPlaceDashboardController {
  constructor(
    private readonly ownerPlaceService: OwnerPlaceService,
    private readonly placeChangeService: PlaceChangeService,
    private readonly placeHourService: PlaceHourService,
    private readonly amenityService: AmenityService,
  ) {}

  @Get('search')
  async search(
    @LoggedInUser() _currentUser: Principal,
    @Query() query: OwnerPlaceSearchQueryDto,
  ): Promise<OwnerPlaceSearchResponseDto> {
    const { name, limit, offset } = query;
    const page = await this.ownerPlaceService.searchByName({ name, limit, offset });
    return new OwnerPlaceSearchResponseDto(page);
  }

  @Get(':id/hours')
  async readHours(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
  ): Promise<OwnerHoursResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    const week = await this.placeHourService.readRegularWeek(placeId);
    return new OwnerHoursResponseDto(week);
  }

  @Put(':id/hours')
  async saveHours(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Body() body: SaveOwnerHoursRequestDto,
  ): Promise<OwnerHoursSaveResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    const { week } = body;
    assertValidWeek(week);
    const premium = await this.ownerPlaceService.isPremium(placeId);
    if (premium) {
      await this.placeHourService.replaceRegularWeek(placeId, week);
      return new OwnerHoursSaveResponseDto('saved');
    }
    await this.placeChangeService.openEdit({
      userId: currentUser.id,
      placeId,
      payload: { hours: week },
    });
    return new OwnerHoursSaveResponseDto('requested');
  }

  @Post(':id/amenities/:code')
  async addAmenity(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('code') code: string,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.amenityService.addToPlace(placeId, code);
    return new PlaceAmenityChangedResponseDto();
  }

  @Delete(':id/amenities/:code')
  async removeAmenity(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('code') code: string,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.amenityService.removeFromPlace(placeId, code);
    return new PlaceAmenityChangedResponseDto();
  }

  @Get(':id')
  async readSummary(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
  ): Promise<OwnerPlaceDetailResponseDto> {
    const place = await this.ownerPlaceService.readSummary(currentUser.id, placeId);
    return new OwnerPlaceDetailResponseDto(place);
  }

  @Patch(':id/immediate')
  async updateImmediate(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Body() body: ImmediatePlaceRequestDto,
  ): Promise<ImmediatePlaceResponseDto> {
    const { phone, website, email, facebook, instagram, descriptionAr, descriptionEn } = body;
    const saved = await this.ownerPlaceService.updateImmediate({
      userId: currentUser.id,
      placeId,
      fields: { phone, website, email, facebook, instagram, descriptionAr, descriptionEn },
    });
    return new ImmediatePlaceResponseDto(saved);
  }

  @Get()
  async list(@LoggedInUser() currentUser: Principal): Promise<OwnedPlaceListResponseDto> {
    const places = await this.ownerPlaceService.listMine(currentUser.id);
    return new OwnedPlaceListResponseDto(places);
  }

  @Post(':id/claim-code')
  @HttpCode(200)
  async claimWithCode(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Body() body: ClaimCodeRequestDto,
  ): Promise<ClaimCodeResponseDto> {
    const { code } = body;
    await this.ownerPlaceService.claimWithCode({ userId: currentUser.id, placeId, code });
    return new ClaimCodeResponseDto();
  }

  @Post(':id/claims')
  async openClaim(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
  ): Promise<PlaceChangeResponseDto> {
    const created = await this.placeChangeService.openClaim({
      userId: currentUser.id,
      placeId,
    });
    return new PlaceChangeResponseDto(created);
  }

  @Post(':id/change-requests')
  async requestEdit(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Body() body: EditPlaceRequestDto,
  ): Promise<PlaceChangeResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    const { nameAr, nameEn, type, addressAr, addressEn, tourismClass } = body;
    const payload = Object.fromEntries(
      Object.entries({ nameAr, nameEn, type, addressAr, addressEn, tourismClass }).filter(
        (entry) => entry[1] !== undefined,
      ),
    );
    const created = await this.placeChangeService.openEdit({
      userId: currentUser.id,
      placeId,
      payload,
    });
    return new PlaceChangeResponseDto(created);
  }

  @Get(':id/change-requests')
  async listChangeRequests(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
  ): Promise<PlaceChangeListResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    const requests = await this.placeChangeService.listForPlace(placeId);
    return new PlaceChangeListResponseDto(requests);
  }
}
