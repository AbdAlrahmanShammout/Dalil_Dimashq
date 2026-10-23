class ProfileChangeRequestDto {
  const ProfileChangeRequestDto({required this.id});

  final int id;

  factory ProfileChangeRequestDto.fromJson(Map<String, dynamic> json) {
    return ProfileChangeRequestDto(id: (json['id'] as num).toInt());
  }
}
