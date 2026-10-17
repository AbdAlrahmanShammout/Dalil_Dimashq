import 'package:dalil_dimashq/domain/entities/place_enums.dart';

class PlaceSearchQuery {
  const PlaceSearchQuery({
    this.text,
    this.category = PlaceCategory.all,
    this.areaId,
    this.minStars,
    this.hasPhone = false,
    this.sort = PlaceSort.completeness,
    this.limit = 20,
    this.offset = 0,
  });

  final String? text;
  final PlaceCategory category;
  final int? areaId;
  final int? minStars;
  final bool hasPhone;
  final PlaceSort sort;
  final int limit;
  final int offset;
}
