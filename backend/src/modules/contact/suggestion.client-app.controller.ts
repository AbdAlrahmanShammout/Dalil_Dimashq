import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { SuggestionRequestDto } from '@/modules/contact/dto/request/suggestion-request.dto';
import { SuggestionService } from '@/modules/contact/suggestion.service';

@ApiTags('suggestions')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/suggestions')
export class SuggestionClientAppController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @PublicRoute()
  @Post()
  async submit(
    @Body() body: SuggestionRequestDto,
    @Req() request: { ip?: string; user?: Principal },
  ): Promise<MessageResponseDto> {
    const { name, contact, kind, message, placeId } = body;
    const visitorKey = request.user?.id ?? `ip:${request.ip ?? 'unknown'}:${contact}`;
    await this.suggestionService.submit({
      name,
      contact,
      kind,
      message,
      placeId,
      visitorKey,
      bodyBytes: Buffer.byteLength(JSON.stringify(body)),
    });
    return new MessageResponseDto('suggestion_received');
  }
}
