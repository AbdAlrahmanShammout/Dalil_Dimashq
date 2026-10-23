import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/area.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_request.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:dalil_dimashq/domain/repositories/place_repository.dart';
import 'package:dalil_dimashq/domain/usecase/cancel_booking_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_details_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/pages/booking_details_page.dart';

void main() {
  testWidgets('a visitor can cancel before the appointment', (
    WidgetTester tester,
  ) async {
    final _Bookings repository = _Bookings();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: BookingDetailsPage(
          now: DateTime.utc(2026, 10, 24),
          booking: BookingSummary(
            id: 9,
            status: 'confirmed',
            placeId: 'place-1',
            at: DateTime.utc(2026, 11, 1, 10),
            party: 2,
          ),
          bloc: BookingDetailsBloc(
            GetPlaceUseCase(_Places()),
            CancelBookingUseCase(repository),
          ),
        ),
      ),
    );
    await tester.pump();
    await tester.tap(find.text('Cancel booking'));
    await tester.pump();
    expect(repository.cancelledId, 9);
    expect(find.text('Cancelled by you'), findsOneWidget);
  });
}

class _Bookings implements BookingRepository {
  int? cancelledId;

  @override
  Future<Either<Failure, BookingAvailability>> availability(
    String placeId,
  ) async {
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, String>> cancel(int id) async {
    cancelledId = id;
    return const Right<Failure, String>('cancelled_by_customer');
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
}

class _Places implements PlaceRepository {
  @override
  Future<Either<Failure, List<Area>>> areas() async {
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, PlaceDetail>> getPlace(String id) async {
    return Right<Failure, PlaceDetail>(
      PlaceDetail(id: id, type: 'cafe', nameAr: 'Beit'),
    );
  }

  @override
  Future<Either<Failure, PlaceSearchPage>> search(
    PlaceSearchQuery query,
  ) async {
    throw UnimplementedError();
  }
}
