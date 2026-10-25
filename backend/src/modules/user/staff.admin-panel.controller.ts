import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { STAFF_ROLE_ADMIN } from '@/common/constants/staff-role';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { CreateStaffRequestDto } from '@/modules/user/dto/request/create-staff-request.dto';
import {
  StaffAccountListResponseDto,
  StaffAccountResponseDto,
} from '@/modules/user/dto/response/staff-account-response.dto';
import { UserService } from '@/modules/user/user.service';

@ApiTags('staff')
@Audience(ApiAudience.AdminPanel)
@Roles(STAFF_ROLE_ADMIN)
@Controller('admin-panel/staff')
export class StaffAdminPanelController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateStaffRequestDto): Promise<StaffAccountResponseDto> {
    const { email, password, staffRole } = body;
    const created = await this.userService.createStaff({ email, password, staffRole });
    return new StaffAccountResponseDto({
      id: created.id,
      email: created.email,
      staffRole: created.staffRole ?? staffRole,
    });
  }

  @Get()
  async list(): Promise<StaffAccountListResponseDto> {
    const accounts = await this.userService.listStaff();
    return new StaffAccountListResponseDto(accounts);
  }
}
