import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import { SUGGESTION_STATUSES } from '@/modules/contact/repository/suggestion.repository';

export class UpdateSuggestionStatusRequestDto {
  @ApiProperty({ enum: SUGGESTION_STATUSES })
  @IsIn(SUGGESTION_STATUSES)
  status!: string;
}
