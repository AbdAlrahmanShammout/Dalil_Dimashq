import 'package:flutter/material.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

class PlaceActions extends StatelessWidget {
  const PlaceActions({required this.place, required this.links, super.key});

  final PlaceDetail place;
  final PlaceLinks links;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final String? phone = place.phones.isEmpty ? null : place.phones.first;
    final bool hasPoint = place.latitude != null && place.longitude != null;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Wrap(
            spacing: 8,
            children: <Widget>[
              if (phone != null)
                TextButton(
                  key: const Key('place-call'),
                  onPressed: () => links.call(phone),
                  child: Text(l10n.call),
                ),
              if (hasPoint)
                TextButton(
                  key: const Key('place-directions'),
                  onPressed: () => links.openDirections(
                    latitude: place.latitude!,
                    longitude: place.longitude!,
                  ),
                  child: Text(l10n.directions),
                ),
              TextButton(
                key: const Key('place-share'),
                onPressed: () => links.share(shareTextFor(place)),
                child: Text(l10n.share),
              ),
            ],
          ),
          if (phone != null)
            GestureDetector(
              key: const Key('place-phone'),
              onLongPress: () async {
                await links.copyPhone(phone);
                if (!context.mounted) {
                  return;
                }
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(SnackBar(content: Text(l10n.copied)));
              },
              child: Text(phone),
            ),
        ],
      ),
    );
  }
}

String shareTextFor(PlaceDetail place) {
  final StringBuffer text = StringBuffer(place.nameAr);
  if (place.nameEn != null && place.nameEn!.isNotEmpty) {
    text.write('\n${place.nameEn}');
  }
  if (place.phones.isNotEmpty) {
    text.write('\n${place.phones.first}');
  }
  if (place.latitude != null && place.longitude != null) {
    text.write(
      '\nhttps://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}',
    );
  }
  return text.toString();
}
