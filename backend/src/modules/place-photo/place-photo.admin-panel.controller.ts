import { Controller, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { PlacePhotoService } from '@/modules/place-photo/place-photo.service';

@ApiTags('photos')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/photos')
export class PlacePhotoAdminPanelController {
  constructor(private readonly placePhotoService: PlacePhotoService) {}

  @Delete(':id')
  async remove(@Param('id') photoId: string): Promise<PlaceAmenityChangedResponseDto> {
    await this.placePhotoService.removeForStaff(photoId);
    return new PlaceAmenityChangedResponseDto();
  }
}
