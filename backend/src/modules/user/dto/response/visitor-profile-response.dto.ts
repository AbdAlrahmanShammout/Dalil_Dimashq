import { ApiProperty } from '@nestjs/swagger';

import { ProfileLanguage } from '@/modules/user/enum/general.enum';

class BookingPrefillResponseDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly phone: string;

  constructor(name: string, phone: string) {
    this.name = name;
    this.phone = phone;
  }
}

export class VisitorProfileResponseDto {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly birthYear: number;

  @ApiProperty({ enum: ProfileLanguage })
  readonly language: ProfileLanguage;

  @ApiProperty()
  readonly changePending: boolean;

  @ApiProperty()
  readonly bookingPrefill: BookingPrefillResponseDto;

  constructor(profile: {
    firstName: string;
    lastName: string;
    phone: string;
    birthYear: number;
    language: ProfileLanguage;
    changePending: boolean;
  }) {
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.phone = profile.phone;
    this.birthYear = profile.birthYear;
    this.language = profile.language;
    this.changePending = profile.changePending;
    this.bookingPrefill = new BookingPrefillResponseDto(
      `${profile.firstName} ${profile.lastName}`,
      profile.phone,
    );
  }
}
