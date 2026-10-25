import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MinLength } from 'class-validator';

export class PublishLegalRequestDto {
  @ApiProperty({ enum: ['terms', 'privacy'] })
  @IsIn(['terms', 'privacy'])
  kind!: 'terms' | 'privacy';

  @ApiProperty({ enum: ['ar', 'en'] })
  @IsIn(['ar', 'en'])
  language!: 'ar' | 'en';

  @ApiProperty()
  @IsString()
  @MinLength(1)
  body!: string;
}
