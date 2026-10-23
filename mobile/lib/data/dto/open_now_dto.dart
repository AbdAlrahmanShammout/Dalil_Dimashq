class OpenNowDto {
  const OpenNowDto({required this.placeId, required this.openNow});

  final String placeId;
  final bool openNow;

  factory OpenNowDto.fromJson(Map<String, dynamic> json) {
    return OpenNowDto(
      placeId: json['place_id'] as String,
      openNow: json['open_now'] as bool,
    );
  }
}
