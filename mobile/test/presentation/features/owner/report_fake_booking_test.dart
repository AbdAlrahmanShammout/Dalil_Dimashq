import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_booking_repository.dart';
import 'package:dalil_dimashq/domain/usecase/list_place_bookings_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/report_fake_booking_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_bookings_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/place_bookings_page.dart';

void main() {
  testWidgets('the owner sends one fake report with a reason', (
    WidgetTester tester,
  ) async {
    final _Bookings bookings = _Bookings();
    await tester.pumpWidget(_app(bookings));
    await tester.pump();
    await tester.tap(find.byKey(const Key('report-3')));
    await tester.pump();
    expect(bookings.reason, isNull);
    await tester.enterText(find.byKey(const Key('report-reason')), 'رقم خاطئ');
    await tester.tap(find.byKey(const Key('report-3')));
    await tester.pump();
    expect(bookings.reason, 'رقم خاطئ');
    expect(find.byKey(const Key('fake-report-sent')), findsOneWidget);
  });

  testWidgets('a reported or attended booking cannot be reported again', (
    WidgetTester tester,
  ) async {
    final _Bookings bookings = _Bookings(reported: true, status: 'confirmed');
    await tester.pumpWidget(_app(bookings));
    await tester.pump();
    expect(find.byKey(const Key('report-3')), findsNothing);
    bookings.reported = false;
    bookings.status = 'attended';
    await tester.pumpWidget(_app(bookings));
    await tester.pump();
    expect(find.byKey(const Key('report-3')), findsNothing);
  });
}

Widget _app(_Bookings bookings) {
  return MaterialApp(
    locale: const Locale('en'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: PlaceBookingsPage(
      placeId: 'p1',
      bloc: PlaceBookingsBloc(ListPlaceBookingsUseCase(bookings)),
      report: ReportFakeBookingUseCase(bookings),
    ),
  );
}

class _Bookings implements OwnerBookingRepository {
  _Bookings({this.reported = false, this.status = 'confirmed'});

  bool reported;
  String status;
  String? reason;

  @override
  Future<Either<Failure, String>> cancel({
    required int id,
    required String reason,
  }) async {
    return const Right<Failure, String>('cancelled_by_owner');
  }

  @override
  Future<Either<Failure, String>> confirm(int id) async {
    return const Right<Failure, String>('confirmed');
  }

  @override
  Future<Either<Failure, List<OwnerBooking>>> list(String placeId) async {
    return Right<Failure, List<OwnerBooking>>(<OwnerBooking>[
      OwnerBooking(
        id: 3,
        customerName: 'سامر',
        customerPhone: '0999',
        party: 2,
        at: DateTime.utc(2026, 11, 1, 10),
        status: status,
        reported: reported,
      ),
    ]);
  }

  @override
  Future<Either<Failure, String>> mark({
    required int id,
    required bool attended,
  }) async {
    return Right<Failure, String>(attended ? 'attended' : 'no_show');
  }

  @override
  Future<Either<Failure, String>> reject({
    required int id,
    String? reason,
  }) async {
    return const Right<Failure, String>('rejected');
  }

  @override
  Future<Either<Failure, int>> reportFake({
    required int id,
    required String reason,
  }) async {
    this.reason = reason;
    return const Right<Failure, int>(12);
  }
}
