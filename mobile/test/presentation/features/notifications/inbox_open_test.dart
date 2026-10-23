import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/app_notification.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_ban.dart';
import 'package:dalil_dimashq/domain/entities/booking_request.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:dalil_dimashq/domain/repositories/notification_repository.dart';
import 'package:dalil_dimashq/domain/usecase/list_notifications_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/open_notification_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/notifications/bloc/inbox_bloc.dart';
import 'package:dalil_dimashq/presentation/features/notifications/pages/inbox_page.dart';

void main() {
  testWidgets('tapping a notification opens that booking', (
    WidgetTester tester,
  ) async {
    final _Notices notices = _Notices();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: InboxPage(
          bloc: InboxBloc(
            ListNotificationsUseCase(notices),
            OpenNotificationUseCase(notices, LoadBookingUseCase(_Bookings())),
          ),
        ),
      ),
    );
    await tester.pump();
    await tester.tap(find.byKey(const Key('notice-1')));
    await tester.pumpAndSettle();
    expect(notices.readId, 1);
    expect(find.text('place-8'), findsOneWidget);
    expect(find.text('Confirmed'), findsOneWidget);
  });
}

class _Notices implements NotificationRepository {
  int? readId;

  @override
  Future<Either<Failure, List<AppNotification>>> list() async {
    return const Right<Failure, List<AppNotification>>(<AppNotification>[
      AppNotification(id: 1, kind: 'booking_confirmed', bookingId: 8),
    ]);
  }

  @override
  Future<Either<Failure, void>> markRead(int id, DateTime at) async {
    readId = id;
    return const Right<Failure, void>(null);
  }
}

class _Bookings implements BookingRepository {
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
    return Right<Failure, BookingSummary>(
      BookingSummary(id: id, status: 'confirmed', placeId: 'place-8'),
    );
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
