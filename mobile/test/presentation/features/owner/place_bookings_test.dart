import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_booking_repository.dart';
import 'package:dalil_dimashq/domain/usecase/list_place_bookings_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_bookings_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/place_bookings_page.dart';

void main() {
  testWidgets('place bookings show the visitor, party, time, note, and report', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: PlaceBookingsPage(
          placeId: 'p1',
          bloc: PlaceBookingsBloc(ListPlaceBookingsUseCase(_Bookings())),
        ),
      ),
    );
    await tester.pump();
    expect(find.textContaining('سامر'), findsOneWidget);
    expect(find.textContaining('0999'), findsOneWidget);
    expect(find.textContaining('13:00'), findsOneWidget);
    expect(find.textContaining('2'), findsOneWidget);
    expect(find.textContaining('بجانب النافذة'), findsOneWidget);
    expect(find.textContaining('Confirmed'), findsOneWidget);
    expect(find.textContaining('Reported'), findsOneWidget);
  });
}

class _Bookings implements OwnerBookingRepository {
  @override
  Future<Either<Failure, String>> confirm(int id) async {
    return const Right<Failure, String>('confirmed');
  }

  @override
  Future<Either<Failure, String>> reject({required int id, String? reason}) async {
    return const Right<Failure, String>('rejected');
  }

  @override
  Future<Either<Failure, String>> cancel({
    required int id,
    required String reason,
  }) async {
    return const Right<Failure, String>('cancelled_by_owner');
  }

  @override
  Future<Either<Failure, String>> mark({
    required int id,
    required bool attended,
  }) async {
    return Right<Failure, String>(attended ? 'attended' : 'no_show');
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
        note: 'بجانب النافذة',
        status: 'confirmed',
        reported: true,
      ),
    ]);
  }
}
