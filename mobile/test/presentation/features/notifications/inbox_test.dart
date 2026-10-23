import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/app_notification.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/notification_repository.dart';
import 'package:dalil_dimashq/domain/usecase/list_notifications_use_case.dart';
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
}
