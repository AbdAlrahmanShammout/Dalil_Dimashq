import 'package:dalil_dimashq/domain/entities/user_profile.dart';

class ProfileDto {
  const ProfileDto({
    this.displayName = '',
    this.firstName = '',
    this.lastName = '',
    this.phone = '',
    this.birthYear,
    this.language = 'ar',
    this.completedAt,
  });

  final String displayName;
  final String firstName;
  final String lastName;
  final String phone;
  final int? birthYear;
  final String language;
  final String? completedAt;

  factory ProfileDto.fromJson(Map<String, dynamic> json) {
    return ProfileDto(
      displayName: json['display_name'] as String? ?? '',
      firstName: json['first_name'] as String? ?? '',
      lastName: json['last_name'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      birthYear: (json['birth_year'] as num?)?.toInt(),
      language: json['language'] as String? ?? 'ar',
      completedAt: json['completed_at'] as String?,
    );
  }

  UserProfile toEntity({required bool hasPendingChange}) {
    final String joinedName = '$firstName $lastName'.trim();
    final String name = displayName.trim().isEmpty ? joinedName : displayName;
    return UserProfile(
      displayName: name,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      birthYear: birthYear,
      language: language,
      isComplete: completedAt != null && completedAt!.isNotEmpty,
      hasPendingChange: hasPendingChange,
    );
  }
}
