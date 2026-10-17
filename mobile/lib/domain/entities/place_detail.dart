import 'package:dalil_dimashq/domain/entities/place_enums.dart';

class PlaceDetail {
  const PlaceDetail({
    required this.id,
    required this.type,
    required this.nameAr,
    this.nameEn,
    this.areaNameAr,
    this.areaNameEn,
    this.stars,
    this.starSource,
    this.isFeatured = false,
    this.coverPath,
    this.logoPath,
    this.phones = const <String>[],
    this.latitude,
    this.longitude,
  });

  final String id;
  final String type;
  final String nameAr;
  final String? nameEn;
  final String? areaNameAr;
  final String? areaNameEn;
  final int? stars;
  final StarSource? starSource;
  final bool isFeatured;
  final String? coverPath;
  final String? logoPath;
  final List<String> phones;
  final double? latitude;
  final double? longitude;
}
