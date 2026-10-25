import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import { SaveOwnerHoursRequestDto } from '@/modules/owner-place/dto/request/save-owner-hours-request.dto';

export class SaveStaffHoursRequestDto extends SaveOwnerHoursRequestDto {
  @ApiProperty({ enum: ['regular', 'ramadan'] })
  @IsIn(['regular', 'ramadan'])
  season!: 'regular' | 'ramadan';
}
