import 'package:dalil_dimashq/domain/entities/place_offer.dart';
import 'package:json_annotation/json_annotation.dart';

part 'offer_dto.g.dart';

@JsonSerializable()
class OfferDto {
  const OfferDto({
    required this.id,
    required this.titleAr,
    this.titleEn,
    this.detailsAr,
    this.detailsEn,
    this.startsAt,
    this.endsAt,
    this.photoPath,
    this.placeId = '',
  });

  factory OfferDto.fromJson(Map<String, dynamic> json) =>
      _$OfferDtoFromJson(json);

  final int id;
  @JsonKey(name: 'title_ar')
  final String titleAr;
  @JsonKey(name: 'title_en')
  final String? titleEn;
  @JsonKey(name: 'details_ar')
  final String? detailsAr;
  @JsonKey(name: 'details_en')
  final String? detailsEn;
  @JsonKey(name: 'starts_at')
  final DateTime? startsAt;
  @JsonKey(name: 'ends_at')
  final DateTime? endsAt;
  @JsonKey(name: 'photo_path')
  final String? photoPath;
  @JsonKey(name: 'place_id', defaultValue: '')
  final String placeId;

  Map<String, dynamic> toJson() => _$OfferDtoToJson(this);

  PlaceOffer toEntity() {
    return PlaceOffer(
      id: id,
      titleAr: titleAr,
      titleEn: titleEn,
      detailsAr: detailsAr,
      detailsEn: detailsEn,
      startsAt: startsAt,
      endsAt: endsAt,
      photoPath: photoPath,
      placeId: placeId,
    );
  }
}
