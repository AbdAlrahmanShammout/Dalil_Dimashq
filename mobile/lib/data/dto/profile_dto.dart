import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:json_annotation/json_annotation.dart';

part 'profile_dto.g.dart';

@JsonSerializable()
class ProfileDto {
  const ProfileDto({this.displayName = '', this.phone = ''});

  @JsonKey(name: 'display_name', defaultValue: '')
  final String displayName;

  @JsonKey(defaultValue: '')
  final String phone;

  factory ProfileDto.fromJson(Map<String, dynamic> json) =>
      _$ProfileDtoFromJson(json);

  Map<String, dynamic> toJson() => _$ProfileDtoToJson(this);

  UserProfile toEntity() {
    return UserProfile(displayName: displayName, phone: phone);
  }
}
