import 'package:dalil_dimashq/data/dto/place_hour_dto.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/entities/place_hour.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:json_annotation/json_annotation.dart';

part 'place_summary_dto.g.dart';

@JsonSerializable(explicitToJson: true)
class PlaceSummaryDto {
  const PlaceSummaryDto({
    required this.id,
    required this.type,
    required this.nameAr,
    this.nameEn,
    this.areaNameAr,
    this.areaNameEn,
    this.phones = const <String>[],
    this.stars,
    this.starSource,
    this.isFeatured = false,
    this.coverPath,
    this.hours = const <PlaceHourDto>[],
  });

  factory PlaceSummaryDto.fromJson(Map<String, dynamic> json) =>
      _$PlaceSummaryDtoFromJson(json);

  final String id;
  final String type;
  @JsonKey(name: 'name_ar')
  final String nameAr;
  @JsonKey(name: 'name_en')
  final String? nameEn;
  @JsonKey(name: 'area_name_ar')
  final String? areaNameAr;
  @JsonKey(name: 'area_name_en')
  final String? areaNameEn;
  final List<String> phones;
  final int? stars;
  @JsonKey(name: 'star_source')
  final String? starSource;
  @JsonKey(name: 'is_featured')
  final bool isFeatured;
  @JsonKey(name: 'cover_path')
  final String? coverPath;
  final List<PlaceHourDto> hours;

  Map<String, dynamic> toJson() => _$PlaceSummaryDtoToJson(this);

  PlaceSummary toEntity() {
    return PlaceSummary(
      id: id,
      type: type,
      nameAr: nameAr,
      nameEn: nameEn,
      areaNameAr: areaNameAr,
      areaNameEn: areaNameEn,
      phones: phones,
      stars: stars,
      starSource: switch (starSource) {
        'hotel_class' => StarSource.hotelClass,
        'map_rating' => StarSource.mapRating,
        _ => null,
      },
      isFeatured: isFeatured,
      coverPath: coverPath,
      hours: hours
          .map(
            (PlaceHourDto hour) => PlaceHour(
              weekday: hour.weekday,
              opens: hour.opens,
              closes: hour.closes,
            ),
          )
          .toList(),
    );
  }
}
