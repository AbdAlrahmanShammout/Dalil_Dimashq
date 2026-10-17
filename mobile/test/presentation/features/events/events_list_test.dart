import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/event.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/event_repository.dart';
import 'package:dalil_dimashq/domain/usecase/list_events_use_case.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/events/bloc/events_bloc.dart';
import 'package:dalil_dimashq/presentation/features/events/pages/events_page.dart';

void main() {
  testWidgets('published events show title, venue, time, and poster', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        home: EventsPage(
          now: DateTime.utc(2026, 10, 17, 12),
          eventsBloc: EventsBloc(ListEventsUseCase(_EventsRepository())),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Damascus nights'), findsOneWidget);
    expect(find.textContaining('Al Azm'), findsOneWidget);
    expect(find.textContaining('2026'), findsOneWidget);
    expect(find.byKey(const Key('event-poster-4')), findsOneWidget);
    expect(find.text('Draft night'), findsNothing);
  });
}

class _EventsRepository implements EventRepository {
  @override
  Future<Either<Failure, List<Event>>> list() async {
    return Right(<Event>[
      Event(
        id: 4,
        titleAr: 'ليالي دمشق',
        titleEn: 'Damascus nights',
        venueName: 'Al Azm',
        startsAt: DateTime.utc(2026, 11, 2, 18),
        endsAt: DateTime.utc(2026, 11, 2, 22),
        posterPath: 'nights.jpg',
      ),
      Event(
        id: 5,
        titleAr: 'مسودة',
        titleEn: 'Draft night',
        venueName: 'Hidden',
        startsAt: DateTime.utc(2026, 11, 3, 18),
        status: 'draft',
      ),
    ]);
  }
}
