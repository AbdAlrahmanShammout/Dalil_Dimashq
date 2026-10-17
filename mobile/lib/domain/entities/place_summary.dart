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
}
