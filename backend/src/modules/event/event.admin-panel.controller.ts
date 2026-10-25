import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PlaceAmenityChangedResponseDto } from '@/modules/amenity/dto/response/place-amenity-changed-response.dto';
import { SaveStaffEventRequestDto } from '@/modules/event/dto/request/save-staff-event-request.dto';
import { StaffEventCreatedResponseDto } from '@/modules/event/dto/response/staff-event-created-response.dto';
import { EventService } from '@/modules/event/event.service';

interface UploadedPoster {
  readonly originalname: string;
  readonly mimetype: string;
  readonly buffer: Uint8Array;
}

@ApiTags('events')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/events')
export class EventAdminPanelController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() body: SaveStaffEventRequestDto,
    @UploadedFile() file?: UploadedPoster,
  ): Promise<StaffEventCreatedResponseDto> {
    const created = await this.eventService.createStaff({
      ...toFields(body),
      poster: toPoster(file),
    });
    return new StaffEventCreatedResponseDto(created.id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() body: SaveStaffEventRequestDto,
    @UploadedFile() file?: UploadedPoster,
  ): Promise<PlaceAmenityChangedResponseDto> {
    await this.eventService.updateStaff(id, { ...toFields(body), poster: toPoster(file) });
    return new PlaceAmenityChangedResponseDto();
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PlaceAmenityChangedResponseDto> {
    await this.eventService.deleteStaff(id);
    return new PlaceAmenityChangedResponseDto();
  }
}

function toFields(body: SaveStaffEventRequestDto): {
  placeId: string | null;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  addressAr: string | null;
  addressEn: string | null;
  phone: string | null;
  published: boolean;
  startsAt: Date;
} {
  const { titleAr, titleEn, descriptionAr, descriptionEn, published, startsAt } = body;
  return {
    placeId: emptyToNull(body.placeId),
    titleAr,
    titleEn,
    descriptionAr,
    descriptionEn,
    addressAr: emptyToNull(body.addressAr),
    addressEn: emptyToNull(body.addressEn),
    phone: emptyToNull(body.phone),
    published,
    startsAt: new Date(startsAt),
  };
}

function toPoster(
  file: UploadedPoster | undefined,
): { fileName: string; mimeType: string; bytes: Uint8Array } | undefined {
  if (!file?.buffer) {
    return undefined;
  }
  return { fileName: file.originalname, mimeType: file.mimetype, bytes: file.buffer };
}

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
}
