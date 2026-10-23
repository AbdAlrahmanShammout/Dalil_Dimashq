import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/opening_period.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_hours_bloc.dart';

class PlaceHoursPage extends StatelessWidget {
  const PlaceHoursPage({required this.placeId, required this.bloc, super.key});

  final String placeId;
  final PlaceHoursBloc bloc;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final List<String> days = <String>[
      l10n.sunday,
      l10n.monday,
      l10n.tuesday,
      l10n.wednesday,
      l10n.thursday,
      l10n.friday,
      l10n.saturday,
    ];
    return BlocProvider<PlaceHoursBloc>.value(
      value: bloc..add(PlaceHoursStarted(placeId)),
      child: AppScaffold(
        title: l10n.ownerHours,
        body: BlocBuilder<PlaceHoursBloc, PlaceHoursState>(
          builder: (BuildContext context, PlaceHoursState state) {
            return ListView(
              children: <Widget>[
                AppButton(
                  key: const Key('save-hours'),
                  label: l10n.saveHours,
                  onPressed: () => bloc.add(PlaceHoursSubmitted(placeId)),
                ),
                if (state.result == 'saved')
                  Text(l10n.hoursSaved, key: const Key('hours-saved')),
                if (state.result == 'requested')
                  Text(l10n.hoursRequested, key: const Key('hours-requested')),
                ...List<Widget>.generate(days.length, (int weekday) {
                final List<OpeningPeriod> periods = state.week.forDay(weekday);
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(days[weekday]),
                    ...periods.asMap().entries.map(
                      (MapEntry<int, OpeningPeriod> entry) => Text(
                        '${entry.value.opens}–${entry.value.closes}',
                        key: Key('period-$weekday-${entry.key}'),
                      ),
                    ),
                    if (periods.length < PlaceWeek.maxPeriodsPerDay)
                      TextButton(
                        key: Key('add-period-$weekday'),
                        onPressed: () => bloc.add(PlaceHoursPeriodAdded(weekday)),
                        child: Text(l10n.addPeriod),
                      ),
                  ],
                );
              }),
              ],
            );
          },
        ),
      ),
    );
  }
}
