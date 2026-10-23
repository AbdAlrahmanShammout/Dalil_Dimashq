import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/opening_period.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_hours_repository.dart';
import 'package:dalil_dimashq/domain/usecase/load_place_hours_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/save_place_hours_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_hours_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/place_hours_page.dart';

void main() {
  test('ramadan rows stay out of the editor week', () {
    final List<OpeningPeriod> periods = regularOpeningPeriods(
      <Map<String, dynamic>>[
        <String, dynamic>{
          'weekday': 0,
          'opens': '09:00',
          'closes': '17:00',
          'season': 'regular',
        },
        <String, dynamic>{
          'weekday': 0,
          'opens': '20:00',
          'closes': '02:00',
          'season': 'ramadan',
        },
      ],
    );
    expect(periods, hasLength(1));
    expect(periods.single.opens, '09:00');
  });

  testWidgets('a day keeps at most three opening periods', (
    WidgetTester tester,
  ) async {
    tester.view.physicalSize = const Size(800, 2400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: PlaceHoursPage(
          placeId: 'p1',
          bloc: PlaceHoursBloc(
            LoadPlaceHoursUseCase(_Hours()),
            SavePlaceHoursUseCase(_Hours()),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Sunday'), findsOneWidget);
    expect(find.text('Ramadan'), findsNothing);
    await tester.tap(find.byKey(const Key('add-period-0')));
    await tester.pump();
    await tester.tap(find.byKey(const Key('add-period-0')));
    await tester.pump();
    await tester.tap(find.byKey(const Key('add-period-0')));
    await tester.pump();
    expect(find.text('09:00–17:00'), findsNWidgets(3));
    expect(find.byKey(const Key('add-period-0')), findsNothing);
  });

  testWidgets('saving reports saved or requested', (WidgetTester tester) async {
    final _Hours saved = _Hours();
    await tester.pumpWidget(_hoursPage(saved));
    await tester.pump();
    await tester.tap(find.byKey(const Key('save-hours')));
    await tester.pump();
    expect(saved.week?.periods, isEmpty);
    expect(find.byKey(const Key('hours-saved')), findsOneWidget);
    final _Hours requested = _Hours(result: 'requested');
    await tester.pumpWidget(_hoursPage(requested));
    await tester.pump();
    await tester.tap(find.byKey(const Key('save-hours')));
    await tester.pump();
    expect(find.byKey(const Key('hours-requested')), findsOneWidget);
  });
}

Widget _hoursPage(_Hours hours) {
  return MaterialApp(
    locale: const Locale('en'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: PlaceHoursPage(
      placeId: 'p1',
      bloc: PlaceHoursBloc(
        LoadPlaceHoursUseCase(hours),
        SavePlaceHoursUseCase(hours),
      ),
    ),
  );
}

class _Hours implements PlaceHoursRepository {
  _Hours({this.result = 'saved'});

  final String result;
  PlaceWeek? week;

  @override
  Future<Either<Failure, PlaceWeek>> load(String placeId) async {
    return const Right<Failure, PlaceWeek>(PlaceWeek());
  }

  @override
  Future<Either<Failure, String>> save({
    required String placeId,
    required PlaceWeek week,
  }) async {
    this.week = week;
    return Right<Failure, String>(result);
  }
}
