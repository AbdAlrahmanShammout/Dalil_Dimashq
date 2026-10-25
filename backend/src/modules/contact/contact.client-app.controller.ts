import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { ContactMessageService } from '@/modules/contact/contact-message.service';
import { ContactMessageRequestDto } from '@/modules/contact/dto/request/contact-message-request.dto';
import { ContactStoredResponseDto } from '@/modules/contact/dto/response/contact-stored-response.dto';

@ApiTags('contact')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/contact')
export class ContactClientAppController {
  constructor(private readonly contactMessageService: ContactMessageService) {}

  @PublicRoute()
  @Post()
  async submit(
    @Body() body: ContactMessageRequestDto,
    @Req() request: { ip?: string; user?: Principal },
  ): Promise<ContactStoredResponseDto> {
    const { name, email, phone, type, message, website } = body;
    const identity = email ?? phone ?? 'anonymous';
    const visitorKey = request.user?.id ?? `ip:${request.ip ?? 'unknown'}:${identity}`;
    const stored = await this.contactMessageService.submit({
      name,
      email,
      phone,
      type,
      message,
      website,
      visitorKey,
      bodyBytes: Buffer.byteLength(JSON.stringify(body)),
    });
    return new ContactStoredResponseDto(stored);
  }
}
