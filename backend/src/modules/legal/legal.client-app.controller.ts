import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { resolveErrorLanguage } from '@/common/filter/resolve-error-language';
import { AcceptLegalRequestDto } from '@/modules/legal/dto/request/accept-legal-request.dto';
import { AcceptLegalResponseDto } from '@/modules/legal/dto/response/accept-legal-response.dto';
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

  @Get('pending')
  async listPending(@LoggedInUser() currentUser: Principal): Promise<LegalDocumentResponseDto[]> {
    const documents = await this.legalService.listPending(currentUser.id);
    return documents.map((document) => new LegalDocumentResponseDto(document));
  }

  @Post('accept')
  async accept(
    @LoggedInUser() currentUser: Principal,
    @Body() body: AcceptLegalRequestDto,
  ): Promise<AcceptLegalResponseDto> {
    const { documentId } = body;
    await this.legalService.acceptDocument(currentUser.id, documentId);
    return new AcceptLegalResponseDto();
  }
}
