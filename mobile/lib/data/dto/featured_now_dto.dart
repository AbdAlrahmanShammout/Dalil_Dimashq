import 'package:json_annotation/json_annotation.dart';

part 'featured_now_dto.g.dart';

@JsonSerializable()
class FeaturedNowDto {
  const FeaturedNowDto({required this.placeId, required this.type});

  factory FeaturedNowDto.fromJson(Map<String, dynamic> json) =>
      _$FeaturedNowDtoFromJson(json);

  @JsonKey(name: 'place_id')
  final String placeId;
  final String type;

  Map<String, dynamic> toJson() => _$FeaturedNowDtoToJson(this);
}
