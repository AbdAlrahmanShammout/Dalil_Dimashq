import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/entities/place_hour.dart';

class PlaceSummary {
  const PlaceSummary({
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
    this.hours = const <PlaceHour>[],
    this.latitude,
    this.longitude,
    this.openNow,
  });

  final String id;
  final String type;
  final String nameAr;
  final String? nameEn;
  final String? areaNameAr;
  final String? areaNameEn;
  final List<String> phones;
  final int? stars;
  final StarSource? starSource;
  final bool isFeatured;
  final String? coverPath;
  final List<PlaceHour> hours;
  final double? latitude;
  final double? longitude;
  final bool? openNow;

  PlaceSummary withOpenNow(bool? openNow) {
    return PlaceSummary(
      id: id,
      type: type,
      nameAr: nameAr,
      nameEn: nameEn,
      areaNameAr: areaNameAr,
      areaNameEn: areaNameEn,
      phones: phones,
      stars: stars,
      starSource: starSource,
      isFeatured: isFeatured,
      coverPath: coverPath,
      hours: hours,
      latitude: latitude,
      longitude: longitude,
      openNow: openNow,
    );
  }
}
