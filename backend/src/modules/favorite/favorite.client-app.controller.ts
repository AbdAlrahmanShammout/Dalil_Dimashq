import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { FavoriteListResponseDto } from '@/modules/favorite/dto/response/favorite-list-response.dto';
import { FavoriteRemovedResponseDto } from '@/modules/favorite/dto/response/favorite-removed-response.dto';
import { FavoriteService } from '@/modules/favorite/favorite.service';

@ApiTags('favorites')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/favorites')
export class FavoriteClientAppController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  async list(@LoggedInUser() currentUser: Principal): Promise<FavoriteListResponseDto> {
    const favorites = await this.favoriteService.list(currentUser.id);
    return new FavoriteListResponseDto(favorites);
  }

  @Post(':placeId')
  async add(
    @LoggedInUser() currentUser: Principal,
    @Param('placeId') placeId: string,
  ): Promise<FavoriteListResponseDto> {
    await this.favoriteService.add(currentUser.id, placeId);
    const favorites = await this.favoriteService.list(currentUser.id);
    return new FavoriteListResponseDto(favorites);
  }

  @Delete(':placeId')
  async remove(
    @LoggedInUser() currentUser: Principal,
    @Param('placeId') placeId: string,
  ): Promise<FavoriteRemovedResponseDto> {
    const { removed } = await this.favoriteService.remove(currentUser.id, placeId);
    return new FavoriteRemovedResponseDto(removed);
  }
}
