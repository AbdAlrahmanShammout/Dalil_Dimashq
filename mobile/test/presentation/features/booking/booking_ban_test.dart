import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_ban.dart';
import 'package:dalil_dimashq/domain/entities/booking_request.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:dalil_dimashq/domain/repositories/session_repository.dart';
import 'package:dalil_dimashq/domain/usecase/has_session_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_availability_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_ban_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_gate_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/widgets/book_place_button.dart';

void main() {
  testWidgets('a 15-day ban blocks a new booking and explains the ladder', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(BookingBan(level: 1, endsAt: DateTime.utc(2026, 11, 8))),
    );
    await tester.pump();
    expect(find.text('Book'), findsNothing);
    expect(find.textContaining('15 days'), findsWidgets);
    expect(find.textContaining('45 days'), findsOneWidget);
    expect(find.textContaining('permanent'), findsOneWidget);
  });

  testWidgets('a permanent ban is explained', (WidgetTester tester) async {
    await tester.pumpWidget(_app(const BookingBan(level: 3)));
    await tester.pump();
    expect(find.textContaining('permanently'), findsOneWidget);
    expect(find.text('Book'), findsNothing);
  });
}

Widget _app(BookingBan ban) {
  final _Banned repository = _Banned(ban);
  return MaterialApp(
    locale: const Locale('en'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: Scaffold(
      body: BookPlaceButton(
        placeId: 'place-1',
        bloc: BookingGateBloc(
          LoadBookingAvailabilityUseCase(repository),
          HasSessionUseCase(_Session()),
          LoadBookingBanUseCase(repository),
        ),
      ),
    ),
  );
}

class _Session implements SessionRepository {
  @override
  bool hasSession() => true;
}

class _Banned implements BookingRepository {
  _Banned(this.ban);

  final BookingBan ban;

  @override
  Future<Either<Failure, BookingBan?>> activeBan(DateTime now) async {
    return Right<Failure, BookingBan?>(ban);
  }

  @override
  Future<Either<Failure, BookingAvailability>> availability(
    String placeId,
  ) async {
    return Right<Failure, BookingAvailability>(
      BookingAvailability(
        isAvailable: true,
        maxParty: 4,
        confirmMinutes: 30,
        minimumNoticeMinutes: 0,
        horizonDays: 7,
        lastDate: null,
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
  Future<Either<Failure, String>> cancel(int id) async {
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, int>> create(BookingRequest request) async {
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, BookingSummary>> find(int id) async {
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, List<BookingSummary>>> list() async {
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, int?>> reportId(int bookingId) async {
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, void>> replyToReport({
    required int reportId,
    required String reply,
  }) async {
    throw UnimplementedError();
  }
}
