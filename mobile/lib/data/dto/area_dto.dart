import 'package:dalil_dimashq/domain/entities/area.dart';
import 'package:json_annotation/json_annotation.dart';

part 'area_dto.g.dart';

@JsonSerializable()
class AreaDto {
  const AreaDto({required this.id, required this.nameAr, required this.nameEn});

  factory AreaDto.fromJson(Map<String, dynamic> json) =>
      _$AreaDtoFromJson(json);

  final int id;
  @JsonKey(name: 'name_ar')
  final String nameAr;
  @JsonKey(name: 'name_en')
  final String nameEn;

  Map<String, dynamic> toJson() => _$AreaDtoToJson(this);

  Area toEntity() => Area(id: id, nameAr: nameAr, nameEn: nameEn);
}
