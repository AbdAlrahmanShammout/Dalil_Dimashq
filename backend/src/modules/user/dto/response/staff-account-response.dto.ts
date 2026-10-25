import { ApiProperty } from '@nestjs/swagger';

import { StaffAccountRow } from '@/modules/user/repository/user.repository';

export class StaffAccountResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly staffRole: string;

  constructor(account: StaffAccountRow) {
    this.id = account.id;
    this.email = account.email;
    this.staffRole = account.staffRole;
  }
}

export class StaffAccountListResponseDto {
  @ApiProperty({ type: [StaffAccountResponseDto] })
  readonly staff: StaffAccountResponseDto[];

  constructor(accounts: readonly StaffAccountRow[]) {
    this.staff = accounts.map((account) => new StaffAccountResponseDto(account));
  }
}
