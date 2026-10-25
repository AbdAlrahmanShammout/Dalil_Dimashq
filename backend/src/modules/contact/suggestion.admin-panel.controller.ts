import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { UpdateSuggestionStatusRequestDto } from '@/modules/contact/dto/request/update-suggestion-status-request.dto';
import { SuggestionListResponseDto } from '@/modules/contact/dto/response/suggestion-list-response.dto';
import { SuggestionService } from '@/modules/contact/suggestion.service';

@ApiTags('suggestions')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/suggestions')
export class SuggestionAdminPanelController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @Get()
  async list(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<SuggestionListResponseDto> {
    const page = await this.suggestionService.list({
      limit: readPageNumber(limit),
      offset: readPageNumber(offset),
    });
    return new SuggestionListResponseDto(page);
  }

  @Patch(':id')
  async setStatus(
    @Param('id') id: string,
    @Body() body: UpdateSuggestionStatusRequestDto,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.suggestionService.setStatus(id, body.status);
    return new PlaceAmenityChangedResponseDto();
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PlaceAmenityChangedResponseDto> {
    await this.suggestionService.remove(id);
    return new PlaceAmenityChangedResponseDto();
  }
}

function readPageNumber(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
}
