import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_EDITOR } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { PublishLegalRequestDto } from '@/modules/legal/dto/request/publish-legal-request.dto';
import { LegalDocumentResponseDto } from '@/modules/legal/dto/response/legal-document-response.dto';
import { LegalService } from '@/modules/legal/legal.service';

@ApiTags('legal')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_EDITOR)
@Controller('admin-panel/legal')
export class LegalAdminPanelController {
  constructor(private readonly legalService: LegalService) {}

  @Post()
  async publish(@Body() body: PublishLegalRequestDto): Promise<LegalDocumentResponseDto> {
    const { kind, language, body: text } = body;
    const document = await this.legalService.publish({ kind, language, body: text });
    return new LegalDocumentResponseDto(document);
  }
}
