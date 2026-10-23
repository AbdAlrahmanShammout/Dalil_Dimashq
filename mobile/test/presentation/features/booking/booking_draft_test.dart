import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/profile_repository.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:dalil_dimashq/domain/services/booking_clock.dart';
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
  testWidgets('the booking form starts with the saved name and phone', (
    WidgetTester tester,
  ) async {
    final _StoredProfile repository = _StoredProfile(
      const UserProfile(displayName: 'Nour', phone: '0999000000'),
    );
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: BookingDraftPage(
          bloc: BookingDraftBloc(
            LoadProfileUseCase(repository),
            LoadBookingAvailabilityUseCase(_UnusedAvailability()),
            BookingClock(),
            CreateBookingUseCase(_UnusedAvailability()),
            LoadBookingUseCase(_UnusedAvailability()),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Nour'), findsOneWidget);
    expect(find.text('0999000000'), findsOneWidget);
  });
}

class _UnusedAvailability implements BookingRepository {
  @override
  Future<Either<Failure, BookingAvailability>> availability(
    String placeId,
  ) async {
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
  Future<Either<Failure, String>> cancel(int id) async {
    throw UnimplementedError();
  }
}

class _StoredProfile implements ProfileRepository {
  _StoredProfile(this.profile);

  final UserProfile profile;

  @override
  Future<Either<Failure, UserProfile>> load() async => Right(profile);

  @override
  Future<Either<Failure, UserProfile>> complete(ProfileDraft draft) async {
    return Right(profile);
  }

  @override
  Future<Either<Failure, UserProfile>> updatePhone({
    required String phone,
    required String language,
  }) async {
    return Right(profile);
  }

  @override
  Future<Either<Failure, UserProfile>> requestChange(ProfileDraft draft) async {
    return Right(profile);
  }
}
