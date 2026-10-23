import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/app_notification.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/notification_repository.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_ban.dart';
import 'package:dalil_dimashq/domain/entities/booking_request.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:dalil_dimashq/domain/usecase/list_notifications_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/open_notification_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/notifications/bloc/inbox_bloc.dart';
import 'package:dalil_dimashq/presentation/features/notifications/pages/inbox_page.dart';

void main() {
  testWidgets('the inbox marks unread booking and report notices', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: InboxPage(
          bloc: InboxBloc(
            ListNotificationsUseCase(
              _Notices(<AppNotification>[
                const AppNotification(
                  id: 1,
                  kind: 'booking_confirmed',
                  bookingId: 8,
                ),
                AppNotification(
                  id: 2,
                  kind: 'fake_report_new',
                  readAt: DateTime.utc(2026, 10, 21),
                ),
              ]),
            ),
            OpenNotificationUseCase(_Notices(const <AppNotification>[]), LoadBookingUseCase(_UnusedBookings())),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Booking confirmed'), findsOneWidget);
    expect(find.byKey(const Key('unread-1')), findsOneWidget);
    expect(find.text('New fake-booking report'), findsOneWidget);
    expect(find.byKey(const Key('unread-2')), findsNothing);
  });
}

class _Notices implements NotificationRepository {
  _Notices(this.rows);

  final List<AppNotification> rows;

  @override
  Future<Either<Failure, List<AppNotification>>> list() async {
    return Right<Failure, List<AppNotification>>(rows);
  }

  @override
  Future<Either<Failure, void>> markRead(int id, DateTime at) async {
    return const Right<Failure, void>(null);
  }
}

class _UnusedBookings implements BookingRepository {
  @override
  Future<Either<Failure, BookingBan?>> activeBan(DateTime now) async {
    throw UnimplementedError();
  }

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
