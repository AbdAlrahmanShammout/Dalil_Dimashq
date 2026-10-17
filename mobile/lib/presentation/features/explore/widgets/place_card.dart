import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/config/app_config.dart';
import 'package:dalil_dimashq/core/theme/app_colors.dart';
import 'package:dalil_dimashq/domain/entities/place_open_now.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

class PlaceCard extends StatelessWidget {
  const PlaceCard({required this.place, this.now, super.key});

  final PlaceSummary place;
  final DateTime? now;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final bool isArabic = Localizations.localeOf(context).languageCode == 'ar';
    final String? area = isArabic ? place.areaNameAr : place.areaNameEn;
    final bool? open = isOpenNow(
      place.hours,
      now ?? damascusTime(DateTime.now()),
    );
    final String? cover = _coverUrl(place.coverPath);
    return Card(
      color: AppColors.charcoalRaised,
      child: ListTile(
        leading: cover == null
            ? const Icon(Icons.storefront)
            : Image.network(cover, width: 48, height: 48, fit: BoxFit.cover),
        title: Text(isArabic ? place.nameAr : (place.nameEn ?? place.nameAr)),
        subtitle: Text(
          [
            place.type,
            if (area != null && area.isNotEmpty) area,
            if (place.isFeatured) l10n.featured,
            if (place.stars == null) l10n.notRated else '${place.stars}',
            if (open == true)
              l10n.openNow
            else if (open == false)
              l10n.closedNow,
          ].join(' · '),
        ),
      ),
    );
  }
}

String? _coverUrl(String? path) {
  if (path == null || path.isEmpty || AppConfig.supabaseUrl.isEmpty) {
    return null;
  }
  return '${AppConfig.supabaseUrl}/storage/v1/object/public/place-photos/$path';
}
