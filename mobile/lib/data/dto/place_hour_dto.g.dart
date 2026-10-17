// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_hour_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PlaceHourDto _$PlaceHourDtoFromJson(Map<String, dynamic> json) => PlaceHourDto(
  weekday: (json['weekday'] as num).toInt(),
  opens: json['opens'] as String,
  closes: json['closes'] as String,
);

Map<String, dynamic> _$PlaceHourDtoToJson(PlaceHourDto instance) =>
    <String, dynamic>{
      'weekday': instance.weekday,
      'opens': instance.opens,
      'closes': instance.closes,
    };
