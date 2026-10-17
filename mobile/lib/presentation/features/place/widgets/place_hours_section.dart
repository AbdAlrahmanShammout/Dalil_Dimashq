import 'package:flutter/material.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_hour.dart';
import 'package:dalil_dimashq/domain/entities/place_open_now.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

class PlaceHoursSection extends StatelessWidget {
  const PlaceHoursSection({required this.place, this.now, super.key});

  final PlaceDetail place;
  final DateTime? now;

  @override
  Widget build(BuildContext context) {
    if (place.hours.isEmpty) {
      return const SizedBox.shrink();
    }
    final AppLocalizations l10n = AppLocalizations.of(context);
    final DateTime clock = now ?? damascusTime(DateTime.now());
    final bool? open = isOpenNow(place.hours, clock);
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(l10n.hours, style: Theme.of(context).textTheme.titleMedium),
          if (open != null) Text(open ? l10n.openNow : l10n.closedNow),
          for (final PlaceHour hour in place.hours)
            Text(
              '${_weekdayLabel(l10n, hour.weekday)} ${_clock(hour.opens)}–${_clock(hour.closes)}',
            ),
        ],
      ),
    );
  }

  String _weekdayLabel(AppLocalizations l10n, int weekday) {
    switch (weekday) {
      case 0:
        return l10n.sunday;
      case 1:
        return l10n.monday;
      case 2:
        return l10n.tuesday;
      case 3:
        return l10n.wednesday;
      case 4:
        return l10n.thursday;
      case 5:
        return l10n.friday;
      case 6:
        return l10n.saturday;
      default:
        return l10n.sunday;
    }
  }

  String _clock(String value) {
    if (value.length < 5) {
      return value;
    }
    return value.substring(0, 5);
  }
}
