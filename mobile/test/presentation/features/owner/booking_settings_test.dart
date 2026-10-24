import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_booking_settings.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_settings_repository.dart';
import 'package:dalil_dimashq/domain/usecase/manage_booking_settings_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/booking_settings_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/booking_settings_page.dart';

void main() {
  testWidgets('the owner saves options, reply hours, and a closed period', (
    WidgetTester tester,
  ) async {
    tester.view.physicalSize = const Size(800, 2400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    final _Settings settings = _Settings();
    await tester.pumpWidget(_app(settings));
    await tester.pump();
    expect(find.text('6'), findsOneWidget);
    expect(find.text('30'), findsOneWidget);
    expect(find.textContaining('09:00'), findsOneWidget);
    expect(find.text('عيد'), findsOneWidget);
    await tester.tap(find.byKey(const Key('accepting')));
    await tester.enterText(find.byKey(const Key('max-party')), '4');
    await tester.enterText(find.byKey(const Key('notice-minutes')), '90');
    await tester.tap(find.byKey(const Key('save-options')));
    await tester.pump();
    expect(settings.accepting, isFalse);
    expect(settings.maxParty, 4);
    expect(settings.notice, 90);
    expect(find.byKey(const Key('settings-saved')), findsOneWidget);
    await tester.enterText(find.byKey(const Key('max-party')), '0');
    await tester.tap(find.byKey(const Key('save-options')));
    await tester.pump();
    expect(settings.maxParty, 4);
    await tester.enterText(find.byKey(const Key('reply-weekday')), '2');
    await tester.enterText(find.byKey(const Key('reply-opens')), '11:00');
    await tester.enterText(find.byKey(const Key('reply-closes')), '15:00');
    await tester.tap(find.byKey(const Key('add-reply-hour')));
    await tester.pump();
    expect(settings.addedHour?.weekday, 2);
    expect(find.byKey(const Key('reply-8')), findsOneWidget);
    await tester.tap(find.byKey(const Key('remove-reply-7')));
    await tester.pump();
    expect(settings.removedHour, 7);
    await tester.enterText(
      find.byKey(const Key('closure-start')),
      '2026-12-01T10:00:00.000Z',
    );
    await tester.enterText(
      find.byKey(const Key('closure-end')),
      '2026-12-01T18:00:00.000Z',
    );
    await tester.enterText(find.byKey(const Key('closure-reason')), 'صيانة');
    await tester.tap(find.byKey(const Key('add-closure')));
    await tester.pump();
    expect(settings.addedClosure, 'صيانة');
    expect(find.byKey(const Key('closure-5')), findsOneWidget);
  });
}

Widget _app(_Settings settings) {
  return MaterialApp(
    locale: const Locale('en'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: BookingSettingsPage(
      placeId: 'p1',
      bloc: BookingSettingsBloc(ManageBookingSettingsUseCase(settings)),
    ),
  );
}

class _Settings implements BookingSettingsRepository {
  bool accepting = true;
  int maxParty = 6;
  int notice = 30;
  ReplyHour? addedHour;
  int? removedHour;
  String? addedClosure;
  final List<ReplyHour> _hours = const <ReplyHour>[
    ReplyHour(id: 7, weekday: 0, opens: '09:00', closes: '17:00'),
  ];
  final List<BookingClosure> _closures = <BookingClosure>[
    BookingClosure(
      id: 4,
      startsAt: DateTime.utc(2026, 12, 24),
      endsAt: DateTime.utc(2026, 12, 25),
      reason: 'عيد',
    ),
  ];

  @override
  Future<Either<Failure, void>> addClosure({
    required String placeId,
    required DateTime startsAt,
    required DateTime endsAt,
    String? reason,
  }) async {
    addedClosure = reason;
    _closures.add(
      BookingClosure(
        id: 5,
        startsAt: startsAt,
        endsAt: endsAt,
        reason: reason,
      ),
    );
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> addReplyHour({
    required String placeId,
    required int weekday,
    required String opens,
    required String closes,
  }) async {
    addedHour = ReplyHour(weekday: weekday, opens: opens, closes: closes);
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, PlaceBookingSettings>> load(String placeId) async {
    return Right<Failure, PlaceBookingSettings>(
      PlaceBookingSettings(
        options: BookingOptions(
          accepting: accepting,
          maxParty: maxParty,
          minimumNoticeMinutes: notice,
        ),
        replyHours: <ReplyHour>[
          ..._hours,
          if (addedHour != null)
            ReplyHour(
              id: 8,
              weekday: addedHour!.weekday,
              opens: addedHour!.opens,
              closes: addedHour!.closes,
            ),
        ].where((ReplyHour hour) => hour.id != removedHour).toList(),
        closures: List<BookingClosure>.of(_closures),
      ),
    );
  }

  @override
  Future<Either<Failure, void>> removeClosure(int id) async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> removeReplyHour(int id) async {
    removedHour = id;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> saveOptions({
    required String placeId,
    required bool accepting,
    required int maxParty,
    required int minimumNoticeMinutes,
  }) async {
    this.accepting = accepting;
    this.maxParty = maxParty;
    notice = minimumNoticeMinutes;
    return const Right<Failure, void>(null);
  }
}
