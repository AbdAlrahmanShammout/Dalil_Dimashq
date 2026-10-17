import 'package:dalil_dimashq/domain/entities/event.dart';
import 'package:json_annotation/json_annotation.dart';

part 'event_dto.g.dart';

@JsonSerializable()
class EventDto {
  const EventDto({
    required this.id,
    required this.titleAr,
    required this.venueName,
    required this.startsAt,
    this.titleEn,
    this.posterPath,
    this.descriptionAr,
    this.descriptionEn,
    this.venueAddress,
    this.contactPhone,
    this.placeId,
    this.endsAt,
    this.publishFrom,
    this.status = 'published',
  });

  factory EventDto.fromJson(Map<String, dynamic> json) =>
      _$EventDtoFromJson(json);

  final int id;
  @JsonKey(name: 'title_ar')
  final String titleAr;
  @JsonKey(name: 'title_en')
  final String? titleEn;
  @JsonKey(name: 'venue_name')
  final String venueName;
  @JsonKey(name: 'starts_at')
  final DateTime startsAt;
  @JsonKey(name: 'poster_path')
  final String? posterPath;
  @JsonKey(name: 'description_ar')
  final String? descriptionAr;
  @JsonKey(name: 'description_en')
  final String? descriptionEn;
  @JsonKey(name: 'venue_address')
  final String? venueAddress;
  @JsonKey(name: 'contact_phone')
  final String? contactPhone;
  @JsonKey(name: 'place_id')
  final String? placeId;
  @JsonKey(name: 'ends_at')
  final DateTime? endsAt;
  @JsonKey(name: 'publish_from')
  final DateTime? publishFrom;
  @JsonKey(defaultValue: 'published')
  final String status;

  Map<String, dynamic> toJson() => _$EventDtoToJson(this);

  Event toEntity() {
    return Event(
      id: id,
      titleAr: titleAr,
      titleEn: titleEn,
      venueName: venueName,
      startsAt: startsAt,
      posterPath: posterPath,
      descriptionAr: descriptionAr,
      descriptionEn: descriptionEn,
      venueAddress: venueAddress,
      contactPhone: contactPhone,
      placeId: placeId,
      endsAt: endsAt,
      publishFrom: publishFrom,
      status: status,
    );
  }
}
