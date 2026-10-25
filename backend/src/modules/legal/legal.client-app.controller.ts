import { Controller, Get, Headers, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { resolveErrorLanguage } from '@/common/filter/resolve-error-language';
import { LegalDocumentResponseDto } from '@/modules/legal/dto/response/legal-document-response.dto';
import { LegalService } from '@/modules/legal/legal.service';

class CurrentLegalQueryDto {
  @IsIn(['terms', 'privacy'])
  kind!: 'terms' | 'privacy';
}

@ApiTags('legal')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/legal')
export class LegalClientAppController {
  constructor(private readonly legalService: LegalService) {}

  @PublicRoute()
  @Get('current')
  async readCurrent(
    @Query() query: CurrentLegalQueryDto,
    @Headers('accept-language') acceptLanguage?: string,
  ): Promise<LegalDocumentResponseDto> {
    const { kind } = query;
    const language = resolveErrorLanguage(acceptLanguage);
    const document = await this.legalService.readCurrent(kind, language);
    return new LegalDocumentResponseDto(document);
  }
}
