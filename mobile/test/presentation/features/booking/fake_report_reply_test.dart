import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/area.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_ban.dart';
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
import 'package:dalil_dimashq/domain/usecase/reply_fake_report_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_details_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/pages/booking_details_page.dart';

void main() {
  testWidgets('a reported booking can send a reply', (
    WidgetTester tester,
  ) async {
    final _Bookings repository = _Bookings();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: BookingDetailsPage(
          booking: const BookingSummary(
            id: 4,
            status: 'confirmed',
            placeId: 'place-1',
            reported: true,
          ),
          bloc: BookingDetailsBloc(
            GetPlaceUseCase(_Places()),
            CancelBookingUseCase(repository),
            ReplyFakeReportUseCase(repository),
          ),
        ),
      ),
    );
    await tester.pump();
    await tester.enterText(
      find.byKey(const Key('fake-report-reply')),
      'I did attend',
    );
    await tester.tap(find.byKey(const Key('fake-report-send')));
    await tester.pump();
    expect(repository.reportIdSent, 15);
    expect(repository.reply, 'I did attend');
    expect(find.text('Reply sent'), findsOneWidget);
  });
}

class _Bookings implements BookingRepository {
  int? reportIdSent;
  String? reply;

  @override
  Future<Either<Failure, BookingAvailability>> availability(
    String placeId,
  ) async {
    throw UnimplementedError();
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
    return const Right<Failure, int?>(15);
  }

  @override
  Future<Either<Failure, void>> replyToReport({
    required int reportId,
    required String reply,
  }) async {
    reportIdSent = reportId;
    this.reply = reply;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, BookingBan?>> activeBan(DateTime now) async {
    return const Right<Failure, BookingBan?>(null);
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
