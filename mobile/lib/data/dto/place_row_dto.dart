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
    this.phones = const <String>[],
    this.lat,
    this.lon,
    this.descriptionAr,
    this.descriptionEn,
    this.website,
    this.email,
    this.facebook,
    this.instagram,
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
  @JsonKey(fromJson: phonesFromJson)
  final List<String> phones;
  final double? lat;
  final double? lon;
  @JsonKey(name: 'description_ar')
  final String? descriptionAr;
  @JsonKey(name: 'description_en')
  final String? descriptionEn;
  final String? website;
  final String? email;
  final String? facebook;
  final String? instagram;

  Map<String, dynamic> toJson() => _$PlaceRowDtoToJson(this);
}

List<String> phonesFromJson(Object? value) {
  if (value is! List) {
    return const <String>[];
  }
  return value.map((Object? item) => '$item').toList();
}
