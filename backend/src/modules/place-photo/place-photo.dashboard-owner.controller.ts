import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { OwnerPhotoResponseDto } from '@/modules/place-photo/dto/response/owner-photo-response.dto';
import { OwnerPhotoRoleResponseDto } from '@/modules/place-photo/dto/response/owner-photo-role-response.dto';
import { PlacePhotoService } from '@/modules/place-photo/place-photo.service';
import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';

interface UploadedPhoto {
  readonly originalname: string;
  readonly mimetype: string;
  readonly buffer: Uint8Array;
}

@ApiTags('photos')
@Audience(ApiAudience.DashboardOwner)
@Controller('dashboard-owner/places')
export class PlacePhotoDashboardOwnerController {
  constructor(
    private readonly ownerPlaceService: OwnerPlaceService,
    private readonly placePhotoService: PlacePhotoService,
  ) {}

  @Post(':id/photos')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @UploadedFile() file?: UploadedPhoto,
  ): Promise<OwnerPhotoResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    const bytes = this.placePhotoService.requirePhotoFile(file);
    const created = await this.placePhotoService.addOwnerPhoto({
      placeId,
      fileName: file?.originalname ?? '',
      mimeType: file?.mimetype ?? '',
      bytes,
    });
    return new OwnerPhotoResponseDto(created);
  }

  @Post(':id/photos/:photoId/cover')
  async assignCover(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('photoId') photoId: string,
  ): Promise<OwnerPhotoRoleResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.placePhotoService.assignRole(placeId, photoId, 'cover');
    return new OwnerPhotoRoleResponseDto('cover');
  }

  @Post(':id/photos/:photoId/logo')
  async assignLogo(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('photoId') photoId: string,
  ): Promise<OwnerPhotoRoleResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.placePhotoService.assignRole(placeId, photoId, 'logo');
    return new OwnerPhotoRoleResponseDto('logo');
  }

  @Delete(':id/photos/:photoId')
  async remove(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Param('photoId') photoId: string,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.ownerPlaceService.assertLinked(currentUser.id, placeId);
    await this.placePhotoService.removeOwnerPhoto(placeId, photoId);
    return new PlaceAmenityChangedResponseDto();
  }
}
