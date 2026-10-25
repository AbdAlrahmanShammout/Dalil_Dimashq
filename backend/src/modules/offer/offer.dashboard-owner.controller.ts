import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { CreateOwnerOfferRequestDto } from '@/modules/offer/dto/request/create-owner-offer-request.dto';
import { OwnerOfferCreatedResponseDto } from '@/modules/offer/dto/response/owner-offer-created-response.dto';
import { OfferService } from '@/modules/offer/offer.service';
import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';

interface UploadedOfferImage {
  readonly originalname: string;
  readonly mimetype: string;
  readonly buffer: Uint8Array;
}

@ApiTags('offers')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/places')
export class OfferDashboardOwnerController {
  constructor(
    private readonly ownerPlaceService: OwnerPlaceService,
    private readonly offerService: OfferService,
  ) {}

  @Post(':id/offers')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Body() body: CreateOwnerOfferRequestDto,
    @UploadedFile() file?: UploadedOfferImage,
  ): Promise<OwnerOfferCreatedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    const { titleAr, titleEn, detailsAr, detailsEn, startsAt, endsAt } = body;
    const created = await this.offerService.createOwnerOffer({
      placeId,
      titleAr,
      titleEn,
      detailsAr,
      detailsEn,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      image: file?.buffer
        ? { fileName: file.originalname, mimeType: file.mimetype, bytes: file.buffer }
        : undefined,
    });
    return new OwnerOfferCreatedResponseDto(created.id);
  }

  @Post(':id/offers/:offerId/stop')
  async stop(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('offerId') offerId: string,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.offerService.stopOwnerOffer(placeId, offerId);
    return new PlaceAmenityChangedResponseDto();
  }

  @Delete(':id/offers/:offerId')
  async remove(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('offerId') offerId: string,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.offerService.deleteOwnerOffer(placeId, offerId);
    return new PlaceAmenityChangedResponseDto();
  }
}
