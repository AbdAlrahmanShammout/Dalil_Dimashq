import 'package:dalil_dimashq/domain/entities/place_hour.dart';
import 'package:json_annotation/json_annotation.dart';

part 'place_hour_dto.g.dart';

@JsonSerializable()
class PlaceHourDto {
  const PlaceHourDto({
    required this.weekday,
    required this.opens,
    required this.closes,
  });

  factory PlaceHourDto.fromJson(Map<String, dynamic> json) =>
      _$PlaceHourDtoFromJson(json);

  final int weekday;
  final String opens;
  final String closes;

  Map<String, dynamic> toJson() => _$PlaceHourDtoToJson(this);

  PlaceHour toEntity() {
    return PlaceHour(weekday: weekday, opens: opens, closes: closes);
  }
}
