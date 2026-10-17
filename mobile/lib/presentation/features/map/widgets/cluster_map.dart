import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/place_cluster.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/domain/services/device_location.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

class ClusterMap extends StatefulWidget {
  const ClusterMap({
    required this.places,
    this.center,
    this.onOpenPlace,
    this.location,
    super.key,
  });

  final List<PlaceSummary> places;
  final String? center;
  final ValueChanged<PlaceSummary>? onOpenPlace;
  final DeviceLocation? location;

  @override
  State<ClusterMap> createState() => _ClusterMapState();
}

class _ClusterMapState extends State<ClusterMap> {
  String? _expandedKey;
  String? _selectedId;
  String? _center;

  Future<void> _centerOnMe() async {
    final DeviceLocation location = widget.location ?? getIt<DeviceLocation>();
    final bool granted = await location.requestPermission();
    if (!granted || !mounted) {
      return;
    }
    final GeoPoint? point = await location.currentPosition();
    if (point == null || !mounted) {
      return;
    }
    setState(() => _center = '${point.latitude},${point.longitude}');
  }

  @override
  Widget build(BuildContext context) {
    final List<PlaceCluster> clusters = clusterPlaces(widget.places);
    final PlaceSummary? selected = _selected();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        if (widget.center != null || _center != null)
          Text(widget.center ?? _center!, key: const Key('map-center')),
        TextButton(
          key: const Key('near-me'),
          onPressed: _centerOnMe,
          child: Text(AppLocalizations.of(context).nearMe),
        ),
        Wrap(
          spacing: 8,
          children: clusters.expand<Widget>((PlaceCluster cluster) {
            final bool showMembers = cluster.isSingle || _expandedKey == cluster.key;
            if (!showMembers) {
              return <Widget>[
                TextButton(
                  key: Key('cluster-${cluster.key}'),
                  onPressed: () => setState(() => _expandedKey = cluster.key),
                  child: Text('${cluster.places.length}'),
                ),
              ];
            }
            return cluster.places.map((PlaceSummary place) {
              return TextButton(
                key: Key('marker-${place.id}'),
                onPressed: () => setState(() => _selectedId = place.id),
                child: Text(place.nameAr),
              );
            });
          }).toList(),
        ),
        if (_selectedId != null)
          Text(_selectedId!, key: const Key('map-selected')),
        if (selected != null)
          ListTile(
            key: const Key('marker-preview'),
            title: Text(selected.nameEn ?? selected.nameAr),
            onTap: widget.onOpenPlace == null
                ? null
                : () => widget.onOpenPlace!(selected),
          ),
      ],
    );
  }

  PlaceSummary? _selected() {
    for (final PlaceSummary place in widget.places) {
      if (place.id == _selectedId) {
        return place;
      }
    }
    return null;
  }
}
