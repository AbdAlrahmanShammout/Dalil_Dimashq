import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/network/place_photo_url.dart';
import 'package:dalil_dimashq/core/theme/category_fallback.dart';
import 'package:dalil_dimashq/core/theme/app_colors.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

class PlaceHeader extends StatelessWidget {
  const PlaceHeader({required this.place, super.key});

  final PlaceDetail place;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final bool isArabic = Localizations.localeOf(context).languageCode == 'ar';
    final String? area = isArabic ? place.areaNameAr : place.areaNameEn;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        _PhotoSlot(
          slotKey: const Key('place-cover'),
          path: place.coverPath,
          fallbackType: place.type,
          height: 180,
          icon: Icons.storefront,
        ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              _PhotoSlot(
                slotKey: const Key('place-logo'),
                path: place.logoPath,
                height: 64,
                width: 64,
                icon: Icons.store,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      place.nameAr,
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    if (place.nameEn != null && place.nameEn!.isNotEmpty)
                      Text(place.nameEn!),
                    Text(place.type),
                    if (area != null && area.isNotEmpty) Text(area),
                    if (place.isFeatured) Text(l10n.featured),
                    Text(_starsLabel(l10n)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _starsLabel(AppLocalizations l10n) {
    if (place.stars == null) {
      return l10n.notRated;
    }
    final String source = place.starSource == StarSource.hotelClass
        ? l10n.hotelClass
        : l10n.mapRating;
    return '${place.stars} · $source';
  }
}

class _PhotoSlot extends StatelessWidget {
  const _PhotoSlot({
    required this.slotKey,
    required this.path,
    required this.height,
    required this.icon,
    this.fallbackType,
    this.width,
  });

  final Key slotKey;
  final String? path;
  final String? fallbackType;
  final double height;
  final double? width;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final String? url = placePhotoUrl(path);
    return SizedBox(
      key: slotKey,
      width: width ?? double.infinity,
      height: height,
      child: url != null
          ? Image.network(url, fit: BoxFit.cover)
          : fallbackType == null
          ? ColoredBox(
              color: AppColors.charcoalRaised,
              child: Icon(icon, color: AppColors.gold),
            )
          : Image.asset(
              categoryFallbackAsset(fallbackType!),
              fit: BoxFit.cover,
            ),
    );
  }
}
