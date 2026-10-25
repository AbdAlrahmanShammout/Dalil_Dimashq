import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptLegalRequestDto {
  @ApiProperty()
  @IsString()
  documentId!: string;
}
