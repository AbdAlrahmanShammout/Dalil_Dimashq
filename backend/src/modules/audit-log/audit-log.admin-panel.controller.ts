import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_ADMIN } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { AuditLogListResponseDto } from '@/modules/audit-log/dto/response/audit-log-list-response.dto';
import { AuditLogService } from '@/modules/audit-log/audit-log.service';

@ApiTags('audit-log')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_ADMIN)
@Controller('admin-panel/audit-log')
export class AuditLogAdminPanelController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async list(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<AuditLogListResponseDto> {
    const page = await this.auditLogService.list({
      limit: readPageNumber(limit),
      offset: readPageNumber(offset),
    });
    return new AuditLogListResponseDto(page);
  }
}

function readPageNumber(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
}
