// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offer_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfferDto _$OfferDtoFromJson(Map<String, dynamic> json) => OfferDto(
  id: (json['id'] as num).toInt(),
  titleAr: json['title_ar'] as String,
  titleEn: json['title_en'] as String?,
  detailsAr: json['details_ar'] as String?,
  detailsEn: json['details_en'] as String?,
  startsAt: json['starts_at'] == null
      ? null
      : DateTime.parse(json['starts_at'] as String),
  endsAt: json['ends_at'] == null
      ? null
      : DateTime.parse(json['ends_at'] as String),
  photoPath: json['photo_path'] as String?,
  placeId: json['place_id'] as String? ?? '',
);

Map<String, dynamic> _$OfferDtoToJson(OfferDto instance) => <String, dynamic>{
  'id': instance.id,
  'title_ar': instance.titleAr,
  'title_en': instance.titleEn,
  'details_ar': instance.detailsAr,
  'details_en': instance.detailsEn,
  'starts_at': instance.startsAt?.toIso8601String(),
  'ends_at': instance.endsAt?.toIso8601String(),
  'photo_path': instance.photoPath,
  'place_id': instance.placeId,
};
