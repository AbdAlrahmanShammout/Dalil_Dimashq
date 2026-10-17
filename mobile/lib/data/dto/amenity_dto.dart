import 'package:dalil_dimashq/domain/entities/amenity.dart';
import 'package:json_annotation/json_annotation.dart';

part 'amenity_dto.g.dart';

@JsonSerializable()
class AmenityDto {
  const AmenityDto({
    required this.code,
    required this.nameAr,
    required this.nameEn,
  });

  factory AmenityDto.fromJson(Map<String, dynamic> json) =>
      _$AmenityDtoFromJson(json);

  final String code;
  @JsonKey(name: 'name_ar')
  final String nameAr;
  @JsonKey(name: 'name_en')
  final String nameEn;

  Map<String, dynamic> toJson() => _$AmenityDtoToJson(this);

  Amenity toEntity() => Amenity(code: code, nameAr: nameAr, nameEn: nameEn);
}

@JsonSerializable()
class PlaceAmenityDto {
  const PlaceAmenityDto({required this.amenity});

  factory PlaceAmenityDto.fromJson(Map<String, dynamic> json) =>
      _$PlaceAmenityDtoFromJson(json);

  final String amenity;

  Map<String, dynamic> toJson() => _$PlaceAmenityDtoToJson(this);
}
