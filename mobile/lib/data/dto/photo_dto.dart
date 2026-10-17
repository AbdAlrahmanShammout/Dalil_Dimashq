import 'package:json_annotation/json_annotation.dart';

part 'photo_dto.g.dart';

@JsonSerializable()
class PhotoDto {
  const PhotoDto({
    this.id = 0,
    required this.storagePath,
    this.isCover = false,
    this.isLogo = false,
  });

  factory PhotoDto.fromJson(Map<String, dynamic> json) =>
      _$PhotoDtoFromJson(json);

  @JsonKey(defaultValue: 0)
  final int id;
  @JsonKey(name: 'storage_path')
  final String storagePath;
  @JsonKey(name: 'is_cover', defaultValue: false)
  final bool isCover;
  @JsonKey(name: 'is_logo', defaultValue: false)
  final bool isLogo;

  Map<String, dynamic> toJson() => _$PhotoDtoToJson(this);
}
