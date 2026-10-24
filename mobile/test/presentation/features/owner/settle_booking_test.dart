import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_booking_repository.dart';
import 'package:dalil_dimashq/domain/services/attendance_window.dart';
import 'package:dalil_dimashq/domain/usecase/list_place_bookings_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/settle_booking_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_bookings_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/place_bookings_page.dart';

void main() {
  final DateTime bookingAt = DateTime.utc(2026, 11, 1, 10);

  test('attendance is open from 30 minutes before until 3 days after', () {
    expect(
      canMarkAttendance(
        bookingAt: bookingAt,
        now: bookingAt.subtract(const Duration(minutes: 31)),
      ),
      isFalse,
    );
    expect(
      canMarkAttendance(
        bookingAt: bookingAt,
        now: bookingAt.subtract(const Duration(minutes: 30)),
      ),
      isTrue,
    );
    expect(
      canMarkAttendance(
        bookingAt: bookingAt,
        now: bookingAt.add(const Duration(days: 3)),
      ),
      isTrue,
    );
    expect(
      canMarkAttendance(
        bookingAt: bookingAt,
        now: bookingAt.add(const Duration(days: 3, minutes: 1)),
      ),
      isFalse,
    );
  });

  testWidgets('the owner cancels with a reason and marks attendance in the window', (
    WidgetTester tester,
  ) async {
    final _Bookings bookings = _Bookings();
    await tester.pumpWidget(
      _app(
        bookings: bookings,
        now: bookingAt.subtract(const Duration(minutes: 10)),
      ),
    );
    await tester.pump();
    expect(find.byKey(const Key('attended-3')), findsOneWidget);
    await tester.tap(find.byKey(const Key('cancel-3')));
    await tester.pump();
    expect(bookings.cancelledReason, isNull);
    await tester.enterText(find.byKey(const Key('cancel-reason')), 'المطبخ مغلق');
    await tester.tap(find.byKey(const Key('cancel-3')));
    await tester.pump();
    expect(bookings.cancelledReason, 'المطبخ مغلق');
    await tester.tap(find.byKey(const Key('attended-3')));
    await tester.pump();
    expect(bookings.attended, isTrue);
    await tester.tap(find.byKey(const Key('no-show-3')));
    await tester.pump();
    expect(bookings.attended, isFalse);
    expect(find.byKey(const Key('decision-status')), findsOneWidget);
  });

  testWidgets('attendance stays hidden outside the window', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        bookings: _Bookings(),
        now: bookingAt.subtract(const Duration(hours: 2)),
      ),
    );
    await tester.pump();
    expect(find.byKey(const Key('attended-3')), findsNothing);
    expect(find.byKey(const Key('no-show-3')), findsNothing);
    expect(find.byKey(const Key('cancel-3')), findsOneWidget);
  });
}

Widget _app({required _Bookings bookings, required DateTime now}) {
  return MaterialApp(
    locale: const Locale('en'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: PlaceBookingsPage(
      placeId: 'p1',
      bloc: PlaceBookingsBloc(ListPlaceBookingsUseCase(bookings)),
      settle: SettleBookingUseCase(bookings),
      now: now,
    ),
  );
}

class _Bookings implements OwnerBookingRepository {
  String? cancelledReason;
  bool? attended;

  @override
  Future<Either<Failure, String>> cancel({
    required int id,
    required String reason,
  }) async {
    cancelledReason = reason;
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
        status: 'confirmed',
        reported: false,
      ),
    ]);
  }

  @override
  Future<Either<Failure, String>> mark({
    required int id,
    required bool attended,
  }) async {
    this.attended = attended;
    return Right<Failure, String>(attended ? 'attended' : 'no_show');
  }

  @override
  Future<Either<Failure, String>> reject({
    required int id,
    String? reason,
  }) async {
    return const Right<Failure, String>('rejected');
  }
}
