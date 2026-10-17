import 'package:dalil_dimashq/domain/entities/place_summary.dart';

class PlaceCluster {
  const PlaceCluster({
    required this.key,
    required this.latitude,
    required this.longitude,
    required this.places,
  });

  final String key;
  final double latitude;
  final double longitude;
  final List<PlaceSummary> places;

  bool get isSingle => places.length == 1;
}

List<PlaceCluster> clusterPlaces(
  List<PlaceSummary> places, {
  double cellDegrees = 0.01,
}) {
  final Map<String, List<PlaceSummary>> buckets = <String, List<PlaceSummary>>{};
  for (final PlaceSummary place in places) {
    if (place.latitude == null || place.longitude == null) {
      continue;
    }
    final int latBucket = (place.latitude! / cellDegrees).floor();
    final int lonBucket = (place.longitude! / cellDegrees).floor();
    final String key = '$latBucket:$lonBucket';
    buckets.putIfAbsent(key, () => <PlaceSummary>[]).add(place);
  }
  return buckets.entries.map((MapEntry<String, List<PlaceSummary>> entry) {
    final double latitude =
        entry.value.map((PlaceSummary place) => place.latitude!).reduce(
          (double total, double value) => total + value,
        ) /
        entry.value.length;
    final double longitude =
        entry.value.map((PlaceSummary place) => place.longitude!).reduce(
          (double total, double value) => total + value,
        ) /
        entry.value.length;
    return PlaceCluster(
      key: entry.key,
      latitude: latitude,
      longitude: longitude,
      places: entry.value,
    );
  }).toList();
}
