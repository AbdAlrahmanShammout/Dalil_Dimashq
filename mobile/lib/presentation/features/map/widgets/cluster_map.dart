import 'package:flutter/material.dart';
import 'package:dalil_dimashq/domain/entities/place_cluster.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';

class ClusterMap extends StatefulWidget {
  const ClusterMap({required this.places, this.center, super.key});

  final List<PlaceSummary> places;
  final String? center;

  @override
  State<ClusterMap> createState() => _ClusterMapState();
}

class _ClusterMapState extends State<ClusterMap> {
  String? _expandedKey;
  String? _selectedId;

  @override
  Widget build(BuildContext context) {
    final List<PlaceCluster> clusters = clusterPlaces(widget.places);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        if (widget.center != null)
          Text(widget.center!, key: const Key('map-center')),
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
      ],
    );
  }
}
