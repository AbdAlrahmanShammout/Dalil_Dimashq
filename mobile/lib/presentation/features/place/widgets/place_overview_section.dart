import 'package:flutter/material.dart';
import 'package:dalil_dimashq/domain/entities/amenity.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

class PlaceOverviewSection extends StatelessWidget {
  const PlaceOverviewSection({required this.place, super.key});

  final PlaceDetail place;

  @override
  Widget build(BuildContext context) {
    final bool isArabic = Localizations.localeOf(context).languageCode == 'ar';
    final String? description = isArabic
        ? place.descriptionAr
        : place.descriptionEn;
    if ((description == null || description.isEmpty) &&
        place.amenities.isEmpty) {
      return const SizedBox.shrink();
    }
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            AppLocalizations.of(context).overview,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          if (description != null && description.isNotEmpty) ...<Widget>[
            const SizedBox(height: 8),
            Text(description),
          ],
          if (place.amenities.isNotEmpty) ...<Widget>[
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: place.amenities.map((Amenity amenity) {
                final String name = isArabic ? amenity.nameAr : amenity.nameEn;
                return Chip(label: Text(name));
              }).toList(),
            ),
          ],
        ],
      ),
    );
  }
}
