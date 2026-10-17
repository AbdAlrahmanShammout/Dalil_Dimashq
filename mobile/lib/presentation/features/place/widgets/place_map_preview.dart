import 'package:flutter/material.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

class PlaceMapPreview extends StatelessWidget {
  const PlaceMapPreview({required this.place, required this.links, super.key});

  final PlaceDetail place;
  final PlaceLinks links;

  @override
  Widget build(BuildContext context) {
    final double? latitude = place.latitude;
    final double? longitude = place.longitude;
    if (latitude == null || longitude == null) {
      return const SizedBox.shrink();
    }
    final AppLocalizations l10n = AppLocalizations.of(context);
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(l10n.location, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          Text('$latitude, $longitude', key: const Key('place-coordinate')),
          TextButton(
            key: const Key('place-map-directions'),
            onPressed: () => links.openDirections(
              latitude: latitude,
              longitude: longitude,
            ),
            child: Text(l10n.directions),
          ),
        ],
      ),
    );
  }
}
