import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_booking_repository.dart';
import 'package:dalil_dimashq/domain/usecase/decide_booking_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/list_place_bookings_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_bookings_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/place_bookings_page.dart';

void main() {
  testWidgets('the owner confirms, or rejects with an optional reason', (
    WidgetTester tester,
  ) async {
    final _Bookings bookings = _Bookings();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: PlaceBookingsPage(
          placeId: 'p1',
          bloc: PlaceBookingsBloc(ListPlaceBookingsUseCase(bookings)),
          decide: DecideBookingUseCase(bookings),
        ),
      ),
    );
    await tester.pump();
    await tester.tap(find.byKey(const Key('confirm-3')));
    await tester.pump();
    expect(bookings.confirmed, 3);
    await tester.enterText(find.byKey(const Key('reject-reason')), 'مكتمل');
    await tester.tap(find.byKey(const Key('reject-3')));
    await tester.pump();
    expect(bookings.reason, 'مكتمل');
    await tester.enterText(find.byKey(const Key('reject-reason')), '   ');
    await tester.tap(find.byKey(const Key('reject-3')));
    await tester.pump();
    expect(bookings.reason, isNull);
  });
}

class _Bookings implements OwnerBookingRepository {
  int? confirmed;
  String? reason;

  @override
  Future<Either<Failure, String>> confirm(int id) async {
    confirmed = id;
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
        status: 'pending',
        reported: false,
      ),
    ]);
  }

  @override
  Future<Either<Failure, String>> reject({
    required int id,
    String? reason,
  }) async {
    this.reason = reason;
    return const Right<Failure, String>('rejected');
  }
}
