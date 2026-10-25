import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_MODERATOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { DecideRatingRequestDto } from '@/modules/rating/dto/request/decide-rating-request.dto';
import { RatingService } from '@/modules/rating/rating.service';

@ApiTags('ratings')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_MODERATOR)
@Controller('admin-panel/ratings')
export class RatingAdminPanelController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('decide')
  @HttpCode(200)
  async decide(@Body() body: DecideRatingRequestDto): Promise<PlaceAmenityChangedResponseDto> {
    const { ratingId, decision } = body;
    await this.ratingService.decideHeld(ratingId, decision);
    return new PlaceAmenityChangedResponseDto();
  }
}
