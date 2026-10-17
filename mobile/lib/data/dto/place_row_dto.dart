import 'package:json_annotation/json_annotation.dart';

part 'place_row_dto.g.dart';

@JsonSerializable()
class PlaceRowDto {
  const PlaceRowDto({
    required this.id,
    required this.type,
    required this.nameAr,
    this.nameEn,
    this.areaId,
    this.stars,
    this.tourismClass,
  });

  factory PlaceRowDto.fromJson(Map<String, dynamic> json) =>
      _$PlaceRowDtoFromJson(json);

  final String id;
  final String type;
  @JsonKey(name: 'name_ar')
  final String nameAr;
  @JsonKey(name: 'name_en')
  final String? nameEn;
  @JsonKey(name: 'area_id')
  final int? areaId;
  final int? stars;
  @JsonKey(name: 'tourism_class')
  final int? tourismClass;

  Map<String, dynamic> toJson() => _$PlaceRowDtoToJson(this);
}
