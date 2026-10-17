import 'package:flutter/material.dart';
import 'package:dalil_dimashq/domain/entities/event.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/place/pages/place_page.dart';

class EventDetailsPage extends StatelessWidget {
  const EventDetailsPage({
    required this.event,
    this.placeBuilder,
    super.key,
  });

  final Event event;
  final Widget Function(String placeId)? placeBuilder;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final bool isArabic = Localizations.localeOf(context).languageCode == 'ar';
    final String title = isArabic
        ? event.titleAr
        : (event.titleEn ?? event.titleAr);
    final String? description = isArabic
        ? event.descriptionAr
        : event.descriptionEn;
    return AppScaffold(
      title: title,
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: <Widget>[
          if (description != null && description.isNotEmpty) Text(description),
          if (event.venueAddress != null && event.venueAddress!.isNotEmpty)
            Text('${l10n.address}: ${event.venueAddress}'),
          if (event.contactPhone != null && event.contactPhone!.isNotEmpty)
            Text(event.contactPhone!),
          if (event.placeId != null && event.placeId!.isNotEmpty)
            TextButton(
              key: const Key('event-place'),
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) =>
                        placeBuilder?.call(event.placeId!) ??
                        PlacePage(placeId: event.placeId!),
                  ),
                );
              },
              child: Text(l10n.openPlace),
            ),
        ],
      ),
    );
  }
}
