import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_ban.dart';
import 'package:dalil_dimashq/domain/entities/booking_request.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:dalil_dimashq/domain/usecase/list_bookings_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/my_bookings_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/pages/my_bookings_page.dart';

void main() {
  testWidgets('my bookings shows every status', (WidgetTester tester) async {
    const List<String> statuses = <String>[
      'waiting',
      'pending',
      'confirmed',
      'rejected',
      'expired',
      'cancelled_by_customer',
      'cancelled_by_owner',
      'attended',
      'no_show',
    ];
    tester.view.physicalSize = const Size(800, 2000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: MyBookingsPage(
          bloc: MyBookingsBloc(
            ListBookingsUseCase(
              _Bookings(
                statuses
                    .map(
                      (String status) => BookingSummary(
                        id: statuses.indexOf(status) + 1,
                        status: status,
                      ),
                    )
                    .toList(growable: false),
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Waiting'), findsOneWidget);
    expect(find.text('Pending'), findsOneWidget);
    expect(find.text('Confirmed'), findsOneWidget);
    expect(find.text('Rejected'), findsOneWidget);
    expect(find.text('Expired'), findsOneWidget);
    expect(find.text('Cancelled by you'), findsOneWidget);
    expect(find.text('Cancelled by the place'), findsOneWidget);
    expect(find.text('Attended'), findsOneWidget);
    expect(find.text('No show'), findsOneWidget);
  });
}

class _Bookings implements BookingRepository {
  _Bookings(this.rows);

  final List<BookingSummary> rows;

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
    return Right<Failure, List<BookingSummary>>(rows);
  }

  @override
  Future<Either<Failure, String>> cancel(int id) async {
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

  @override
  Future<Either<Failure, BookingBan?>> activeBan(DateTime now) async {
    throw UnimplementedError();
  }
}
