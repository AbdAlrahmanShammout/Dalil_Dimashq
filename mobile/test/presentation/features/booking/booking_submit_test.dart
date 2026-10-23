import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_ban.dart';
import 'package:dalil_dimashq/domain/entities/booking_request.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:dalil_dimashq/domain/repositories/profile_repository.dart';
import 'package:dalil_dimashq/domain/services/booking_clock.dart';
import 'package:dalil_dimashq/domain/usecase/create_booking_use_case.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_availability_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_profile_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_draft_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/pages/booking_draft_page.dart';

void main() {
  testWidgets('submit sends the party, note, and a client key', (
    WidgetTester tester,
  ) async {
    final _RecordingBookings repository = _RecordingBookings();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: BookingDraftPage(
          placeId: 'place-1',
          bloc: BookingDraftBloc(
            LoadProfileUseCase(_Profile()),
            LoadBookingAvailabilityUseCase(repository),
            _Clock(),
            CreateBookingUseCase(repository),
            LoadBookingUseCase(repository),
          ),
        ),
      ),
    );
    await tester.pump();
    await tester.enterText(find.byKey(const Key('booking-note')), 'Window seat');
    await tester.tap(find.text('Send'));
    await tester.pump();
    final BookingRequest? request = repository.request;
    expect(request?.party, 1);
    expect(request?.note, 'Window seat');
    expect(request?.placeId, 'place-1');
    expect(find.text('42'), findsOneWidget);
    expect(find.text('Waiting'), findsOneWidget);
    expect(
      request?.clientKey,
      matches(
        RegExp(
          r'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
        ),
      ),
    );
  });

  test('a party above the maximum is refused', () async {
    final CreateBookingUseCase useCase = CreateBookingUseCase(
      _RecordingBookings(),
    );
    final Either<Failure, int> result = await useCase(
      BookingRequest(
        placeId: 'place-1',
        at: DateTime.utc(2026, 10, 21, 10),
        party: 9,
        name: 'Nour',
        phone: '0999000000',
        clientKey: '11111111-1111-4111-8111-111111111111',
      ),
      maxParty: 4,
    );
    expect(
      result.fold((Failure failure) => failure.message, (_) => ''),
      'party_too_large',
    );
  });

  test('a note over 300 characters is refused', () async {
    final _RecordingBookings repository = _RecordingBookings();
    final CreateBookingUseCase useCase = CreateBookingUseCase(repository);
    final Either<Failure, int> result = await useCase(
      BookingRequest(
        placeId: 'place-1',
        at: DateTime.utc(2026, 10, 21, 10),
        party: 2,
        name: 'Nour',
        phone: '0999000000',
        clientKey: '',
        note: 'n' * 301,
      ),
      maxParty: 4,
    );
    expect(
      result.fold((Failure failure) => failure.message, (_) => ''),
      'note_too_long',
    );
    expect(repository.request, isNull);
  });
}

class _Clock extends BookingClock {
  @override
  DateTime now() => DateTime.utc(2026, 10, 21, 8);
}

class _Profile implements ProfileRepository {
  @override
  Future<Either<Failure, UserProfile>> complete(ProfileDraft draft) async {
    return const Right<Failure, UserProfile>(
      UserProfile(displayName: 'Nour', phone: '0999000000'),
    );
  }

  @override
  Future<Either<Failure, UserProfile>> load() async {
    return const Right<Failure, UserProfile>(
      UserProfile(displayName: 'Nour', phone: '0999000000'),
    );
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

class _RecordingBookings implements BookingRepository {
  BookingRequest? request;

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
        closed: const <BookingPeriod>[],
      ),
    );
  }

  @override
  Future<Either<Failure, int>> create(BookingRequest request) async {
    this.request = request;
    return const Right<Failure, int>(42);
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
