import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_ban.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:dalil_dimashq/domain/repositories/profile_repository.dart';
import 'package:dalil_dimashq/domain/services/booking_clock.dart';
import 'package:dalil_dimashq/domain/services/booking_slots.dart';
import 'package:dalil_dimashq/domain/entities/booking_request.dart';
import 'package:dalil_dimashq/domain/usecase/create_booking_use_case.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_availability_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_profile_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_draft_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/pages/booking_draft_page.dart';

void main() {
  test('slots skip the notice window and closed periods', () {
    final DateTime now = DateTime.utc(2026, 10, 21, 8);
    final List<DateTime> times = bookingTimes(
      date: DateTime.utc(2026, 10, 21),
      now: now,
      slotMinutes: 15,
      noticeMinutes: 60,
      closed: <BookingPeriod>[
        BookingPeriod(
          startsAt: DateTime.utc(2026, 10, 21, 9),
          endsAt: DateTime.utc(2026, 10, 21, 10),
        ),
      ],
    );
    expect(formatDamascusTime(times.first), '13:00');
    expect(
      times.map(formatDamascusTime).contains('12:00'),
      isFalse,
    );
  });

  testWidgets('the form offers a Damascus date and an open slot', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: BookingDraftPage(
          placeId: 'place-1',
          bloc: BookingDraftBloc(
            LoadProfileUseCase(_Profile()),
            LoadBookingAvailabilityUseCase(_Availability()),
            _Clock(),
            CreateBookingUseCase(_Availability()),
            LoadBookingUseCase(_Availability()),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('2026-10-21'), findsOneWidget);
    expect(find.text('13:00'), findsOneWidget);
    expect(find.text('12:00'), findsNothing);
  });
}

class _Clock extends BookingClock {
  @override
  DateTime now() => DateTime.utc(2026, 10, 21, 8);
}

class _Profile implements ProfileRepository {
  @override
  Future<Either<Failure, UserProfile>> complete(ProfileDraft draft) async {
    return const Right<Failure, UserProfile>(UserProfile());
  }

  @override
  Future<Either<Failure, UserProfile>> load() async {
    return const Right<Failure, UserProfile>(UserProfile());
  }

  @override
  Future<Either<Failure, UserProfile>> requestChange(ProfileDraft draft) async {
    return const Right<Failure, UserProfile>(UserProfile());
  }

  @override
  Future<Either<Failure, UserProfile>> updatePhone({
    required String phone,
    required String language,
  }) async {
    return const Right<Failure, UserProfile>(UserProfile());
  }
}

class _Availability implements BookingRepository {
  @override
  Future<Either<Failure, BookingAvailability>> availability(
    String placeId,
  ) async {
    return Right<Failure, BookingAvailability>(
      BookingAvailability(
        isAvailable: true,
        maxParty: 4,
        confirmMinutes: 30,
        minimumNoticeMinutes: 60,
        horizonDays: 1,
        lastDate: DateTime.utc(2026, 10, 21),
        slotMinutes: 15,
        timeZone: 'Asia/Damascus',
        isRespondingNow: true,
        nextResponseAt: null,
        responseHours: const <BookingPeriod>[],
        closed: <BookingPeriod>[
          const BookingPeriod(
            startsAt: null,
            endsAt: null,
          ),
          BookingPeriod(
            startsAt: DateTime.utc(2026, 10, 21, 9),
            endsAt: DateTime.utc(2026, 10, 21, 10),
          ),
        ],
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

  @override
  Future<Either<Failure, int?>> reportId(int bookingId) async {
    return const Right<Failure, int?>(null);
  }

  @override
  Future<Either<Failure, void>> replyToReport({
    required int reportId,
    required String reply,
  }) async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, BookingBan?>> activeBan(DateTime now) async {
    return const Right<Failure, BookingBan?>(null);
  }
}
