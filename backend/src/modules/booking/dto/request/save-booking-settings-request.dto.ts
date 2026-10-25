import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class SaveBookingSettingsRequestDto {
  @ApiProperty()
  @IsBoolean()
  acceptsBookings!: boolean;

  @ApiProperty()
  @IsInt()
  @Min(1)
  maxParty!: number;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  noticeMinutes?: number | null;
}
