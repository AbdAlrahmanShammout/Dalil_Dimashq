import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/core/network/event_poster_url.dart';
import 'package:dalil_dimashq/domain/entities/event.dart';
import 'package:dalil_dimashq/presentation/features/events/bloc/events_bloc.dart';

class EventsPage extends StatelessWidget {
  const EventsPage({this.eventsBloc, this.now, super.key});

  final EventsBloc? eventsBloc;
  final DateTime? now;

  @override
  Widget build(BuildContext context) {
    final EventsBloc bloc = eventsBloc ?? getIt<EventsBloc>();
    return BlocProvider<EventsBloc>.value(
      value: bloc..add(EventsStarted(now ?? DateTime.now())),
      child: const _EventsList(),
    );
  }
}

class _EventsList extends StatelessWidget {
  const _EventsList();

  @override
  Widget build(BuildContext context) {
    final bool isArabic = Localizations.localeOf(context).languageCode == 'ar';
    final DateFormat format = DateFormat.yMMMd(
      Localizations.localeOf(context).toString(),
    ).add_Hm();
    return BlocBuilder<EventsBloc, EventsState>(
      builder: (BuildContext context, EventsState state) {
        return Material(
          color: Colors.transparent,
          child: ListView(
            children: state.events.map((Event event) {
              final String title = isArabic
                  ? event.titleAr
                  : (event.titleEn ?? event.titleAr);
              final String? poster = eventPosterUrl(event.posterPath);
              return ListTile(
                key: Key('event-${event.id}'),
                leading: poster == null
                    ? SizedBox(
                        key: Key('event-poster-${event.id}'),
                        width: 48,
                        height: 48,
                      )
                    : Image.network(
                        poster,
                        key: Key('event-poster-${event.id}'),
                        width: 48,
                        height: 48,
                      ),
                title: Text(title),
                subtitle: Text(
                  '${event.venueName} · ${format.format(event.startsAt.toLocal())}',
                ),
              );
            }).toList(),
          ),
        );
      },
    );
  }
}
