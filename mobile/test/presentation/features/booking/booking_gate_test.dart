import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/data/dto/booking_availability_dto.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_request.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:dalil_dimashq/domain/repositories/session_repository.dart';
import 'package:dalil_dimashq/domain/usecase/has_session_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_availability_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_gate_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/widgets/book_place_button.dart';

void main() {
  testWidgets('book is hidden when the place does not accept bookings', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_app(isAvailable: false, hasSession: true));
    await tester.pump();
    expect(find.text('Book'), findsNothing);
  });

  testWidgets('book requires an account', (WidgetTester tester) async {
    bool? openedWithSession;
    await tester.pumpWidget(
      _app(
        isAvailable: true,
        hasSession: false,
        onOpen: (bool hasSession) => openedWithSession = hasSession,
      ),
    );
    await tester.pump();
    await tester.tap(find.text('Book'));
    expect(openedWithSession, isFalse);
  });

  testWidgets('book opens for a signed-in visitor', (
    WidgetTester tester,
  ) async {
    bool? openedWithSession;
    await tester.pumpWidget(
      _app(
        isAvailable: true,
        hasSession: true,
        onOpen: (bool hasSession) => openedWithSession = hasSession,
      ),
    );
    await tester.pump();
    await tester.tap(find.text('Book'));
    expect(openedWithSession, isTrue);
  });

  test('availability keeps notice, horizon, and closed periods', () {
    final BookingAvailability availability = mapBookingAvailability(
      <String, dynamic>{
        'available': true,
        'max_party': 8,
        'confirm_minutes': 30,
        'minimum_booking_notice_minutes': 60,
        'horizon_days': 7,
        'last_date': '2026-10-28',
        'slot_minutes': 15,
        'time_zone': 'Asia/Damascus',
        'responding_now': false,
        'closed': <Map<String, dynamic>>[
          <String, dynamic>{
            'starts_at': '2026-10-22T18:00:00Z',
            'ends_at': '2026-10-22T20:00:00Z',
          },
        ],
      },
    );
    expect(availability.minimumNoticeMinutes, 60);
    expect(availability.horizonDays, 7);
    expect(availability.slotMinutes, 15);
    expect(availability.closed.single.startsAt, isNotNull);
  });
}

Widget _app({
  required bool isAvailable,
  required bool hasSession,
  void Function(bool hasSession)? onOpen,
}) {
  return MaterialApp(
    locale: const Locale('en'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: Scaffold(
      body: BookPlaceButton(
        placeId: 'place-1',
        onOpen: onOpen,
        bloc: BookingGateBloc(
          LoadBookingAvailabilityUseCase(_Availability(isAvailable)),
          HasSessionUseCase(_Session(hasSession)),
        ),
      ),
    ),
  );
}

class _Availability implements BookingRepository {
  _Availability(this.isAvailable);

  final bool isAvailable;

  @override
  Future<Either<Failure, BookingAvailability>> availability(
    String placeId,
  ) async {
    return Right<Failure, BookingAvailability>(
      BookingAvailability(
        isAvailable: isAvailable,
        maxParty: 6,
        confirmMinutes: 30,
        minimumNoticeMinutes: 60,
        horizonDays: 7,
        lastDate: DateTime.utc(2026, 10, 28),
        slotMinutes: 15,
        timeZone: 'Asia/Damascus',
        isRespondingNow: true,
        nextResponseAt: null,
        responseHours: const <BookingPeriod>[],
        closed: const <BookingPeriod>[],
      ),
    );
  }

  @override
  Future<Either<Failure, int>> create(BookingRequest request) async {
    return const Right<Failure, int>(1);
  }

  @override
  Future<Either<Failure, BookingSummary>> find(int id) async {
    return Right<Failure, BookingSummary>(
      BookingSummary(id: id, status: 'waiting'),
    );
  }

  @override
  Future<Either<Failure, List<BookingSummary>>> list() async {
    return const Right<Failure, List<BookingSummary>>(<BookingSummary>[]);
  }

  @override
  Future<Either<Failure, String>> cancel(int id) async {
    return const Right<Failure, String>('cancelled_by_customer');
  }
}

class _Session implements SessionRepository {
  _Session(this._hasSession);

  final bool _hasSession;

  @override
  bool hasSession() => _hasSession;
}
