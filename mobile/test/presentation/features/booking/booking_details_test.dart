import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/area.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_repository.dart';
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_details_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/pages/booking_details_page.dart';

void main() {
  testWidgets('booking details show the place, time, party, note, and reason', (
    WidgetTester tester,
  ) async {
    const BookingSummary booking = BookingSummary(
      id: 7,
      status: 'rejected',
      placeId: 'place-1',
      at: null,
      party: 3,
      note: 'Window seat',
      reason: 'Full',
    );
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: BookingDetailsPage(
          booking: booking.copyWithTime(DateTime.utc(2026, 10, 21, 10)),
          bloc: BookingDetailsBloc(GetPlaceUseCase(_Places())),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Beit Jabri'), findsOneWidget);
    expect(find.text('2026-10-21 13:00'), findsOneWidget);
    expect(find.text('Party size: 3'), findsOneWidget);
    expect(find.text('Window seat'), findsOneWidget);
    expect(find.text('Reason: Full'), findsOneWidget);
    expect(find.text('Rejected'), findsOneWidget);
  });
}

extension on BookingSummary {
  BookingSummary copyWithTime(DateTime at) {
    return BookingSummary(
      id: this.id,
      status: status,
      placeId: placeId,
      at: at,
      party: party,
      note: note,
      reason: reason,
      reported: reported,
    );
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
      PlaceDetail(id: id, type: 'cafe', nameAr: 'Beit Jabri'),
    );
  }

  @override
  Future<Either<Failure, PlaceSearchPage>> search(PlaceSearchQuery query) async {
    throw UnimplementedError();
  }
}
