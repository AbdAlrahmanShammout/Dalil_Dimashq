import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { CreateRatingRequestDto } from '@/modules/rating/dto/request/create-rating-request.dto';
import { RatingResponseDto } from '@/modules/rating/dto/response/rating-response.dto';
import { RatingService } from '@/modules/rating/rating.service';

@ApiTags('ratings')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/places')
export class RatingClientAppController {
  constructor(private readonly ratingService: RatingService) {}

  @Post(':id/ratings')
  async create(
    @LoggedInUser() currentUser: Principal,
    @Param('id') placeId: string,
    @Body() body: CreateRatingRequestDto,
  ): Promise<RatingResponseDto> {
    const { stars } = body;
    const rating = await this.ratingService.create({
      userId: currentUser.id,
      placeId,
      stars,
    });
    return new RatingResponseDto(rating);
  }
}
