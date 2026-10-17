import 'package:dalil_dimashq/domain/entities/place_summary.dart';

class PlaceCategoryCounts {
  const PlaceCategoryCounts({
    required this.all,
    required this.hotels,
    required this.restaurants,
    required this.cafes,
  });

  final int all;
  final int hotels;
  final int restaurants;
  final int cafes;
}

class PlaceSearchPage {
  const PlaceSearchPage({
    required this.places,
    required this.total,
    required this.counts,
  });

  final List<PlaceSummary> places;
  final int total;
  final PlaceCategoryCounts counts;
}
