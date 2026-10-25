import { Controller, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { OfferService } from '@/modules/offer/offer.service';

@ApiTags('offers')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/offers')
export class OfferAdminPanelController {
  constructor(private readonly offerService: OfferService) {}

  @Delete(':id')
  async remove(@Param('id') offerId: string): Promise<PlaceAmenityChangedResponseDto> {
    await this.offerService.deleteForStaff(offerId);
    return new PlaceAmenityChangedResponseDto();
  }
}
