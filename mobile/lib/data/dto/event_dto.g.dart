// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'event_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventDto _$EventDtoFromJson(Map<String, dynamic> json) => EventDto(
  id: (json['id'] as num).toInt(),
  titleAr: json['title_ar'] as String,
  venueName: json['venue_name'] as String,
  startsAt: DateTime.parse(json['starts_at'] as String),
  titleEn: json['title_en'] as String?,
  posterPath: json['poster_path'] as String?,
  descriptionAr: json['description_ar'] as String?,
  descriptionEn: json['description_en'] as String?,
  venueAddress: json['venue_address'] as String?,
  contactPhone: json['contact_phone'] as String?,
  placeId: json['place_id'] as String?,
  endsAt: json['ends_at'] == null
      ? null
      : DateTime.parse(json['ends_at'] as String),
  publishFrom: json['publish_from'] == null
      ? null
      : DateTime.parse(json['publish_from'] as String),
  status: json['status'] as String? ?? 'published',
);

Map<String, dynamic> _$EventDtoToJson(EventDto instance) => <String, dynamic>{
  'id': instance.id,
  'title_ar': instance.titleAr,
  'title_en': instance.titleEn,
  'venue_name': instance.venueName,
  'starts_at': instance.startsAt.toIso8601String(),
  'poster_path': instance.posterPath,
  'description_ar': instance.descriptionAr,
  'description_en': instance.descriptionEn,
  'venue_address': instance.venueAddress,
  'contact_phone': instance.contactPhone,
  'place_id': instance.placeId,
  'ends_at': instance.endsAt?.toIso8601String(),
  'publish_from': instance.publishFrom?.toIso8601String(),
  'status': instance.status,
};
