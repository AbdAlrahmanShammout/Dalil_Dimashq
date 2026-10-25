import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience, Principal } from '@/common/auth/principal.interface';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { FakeReportReplyRequestDto } from '@/modules/fake-report/dto/request/fake-report-reply-request.dto';
import { FakeReportReplyResponseDto } from '@/modules/fake-report/dto/response/fake-report-reply-response.dto';
import { FakeReportService } from '@/modules/fake-report/fake-report.service';

@ApiTags('fake-reports')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/fake-reports')
export class FakeReportClientAppController {
  constructor(private readonly fakeReportService: FakeReportService) {}

  @Post(':id/reply')
  async reply(
    @LoggedInUser() currentUser: Principal,
    @Param('id') reportId: string,
    @Body() body: FakeReportReplyRequestDto,
  ): Promise<FakeReportReplyResponseDto> {
    const { body: message } = body;
    const reply = await this.fakeReportService.reply({
      userId: currentUser.id,
      reportId,
      body: message,
    });
    return new FakeReportReplyResponseDto(reply);
  }
}
