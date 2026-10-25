import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

import { StaffRole } from '@/modules/user/enum/general.enum';

const CREATABLE_STAFF_ROLES = [StaffRole.Editor, StaffRole.Moderator, StaffRole.Sales] as const;

export class CreateStaffRequestDto {
  @ApiProperty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  password!: string;

  @ApiProperty({ enum: CREATABLE_STAFF_ROLES })
  @IsIn(CREATABLE_STAFF_ROLES)
  staffRole!: StaffRole;
}
