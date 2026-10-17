// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'photo_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PhotoDto _$PhotoDtoFromJson(Map<String, dynamic> json) => PhotoDto(
  id: (json['id'] as num?)?.toInt() ?? 0,
  storagePath: json['storage_path'] as String,
  isCover: json['is_cover'] as bool? ?? false,
  isLogo: json['is_logo'] as bool? ?? false,
);

Map<String, dynamic> _$PhotoDtoToJson(PhotoDto instance) => <String, dynamic>{
  'id': instance.id,
  'storage_path': instance.storagePath,
  'is_cover': instance.isCover,
  'is_logo': instance.isLogo,
};
