import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class DecideProfileChangeRequestDto {
  @ApiProperty({ enum: ['approved', 'rejected'] })
  @IsIn(['approved', 'rejected'])
  decision!: 'approved' | 'rejected';
}
