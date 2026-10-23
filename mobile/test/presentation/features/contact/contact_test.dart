import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/contact_message.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/contact_repository.dart';
import 'package:dalil_dimashq/domain/services/contact_rate_limit.dart';
import 'package:dalil_dimashq/domain/usecase/send_contact_message_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/contact/bloc/contact_bloc.dart';
import 'package:dalil_dimashq/presentation/features/contact/pages/contact_page.dart';

void main() {
  testWidgets('a contact message shows a confirmation', (
    WidgetTester tester,
  ) async {
    final _RecordingContact repository = _RecordingContact();
    final _MemoryHistory history = _MemoryHistory();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: ContactPage(
          bloc: ContactBloc(SendContactMessageUseCase(repository, history)),
        ),
      ),
    );
    await tester.enterText(find.byKey(const Key('contact-name')), 'Rami');
    await tester.enterText(
      find.byKey(const Key('contact-value')),
      'rami@example.com',
    );
    await tester.enterText(
      find.byKey(const Key('contact-message')),
      'Hello from Damascus',
    );
    await tester.tap(find.text('Send'));
    await tester.pump();
    expect(repository.sent?.toJson()['website'], '');
    expect(repository.sent?.type, 'general');
    expect(find.text('Message sent'), findsOneWidget);
    expect(history.recorded, 1);
  });

  test('the client blocks a message over 16 KB', () async {
    final _RecordingContact repository = _RecordingContact();
    final SendContactMessageUseCase useCase = SendContactMessageUseCase(
      repository,
      _MemoryHistory(),
    );
    final ContactMessage message = ContactMessage(
      name: 'Rami',
      contact: 'rami@example.com',
      type: 'general',
      message: 'a' * 17000,
    );
    expect(utf8.encode(jsonEncode(message.toJson())).length, greaterThan(16384));
    final Either<Failure, void> result = await useCase(message);
    expect(result.fold((Failure failure) => failure.message, (_) => ''), 'too_large');
    expect(repository.sent, isNull);
  });

  test('five messages in an hour block the next one', () {
    final DateTime now = DateTime.utc(2026, 10, 21, 12);
    final List<DateTime> sent = List<DateTime>.generate(
      5,
      (int index) => now.subtract(Duration(minutes: index + 1)),
    );
    expect(isContactRateLimited(sentAt: sent, now: now), isTrue);
  });

  test('forty messages in a Damascus day block the next one', () {
    final DateTime now = DateTime.utc(2026, 10, 21, 10);
    final List<DateTime> sent = List<DateTime>.generate(
      40,
      (int index) => now.subtract(Duration(hours: 2, minutes: index)),
    );
    expect(isContactRateLimited(sentAt: sent, now: now), isTrue);
  });
}

class _RecordingContact implements ContactRepository {
  ContactMessage? sent;

  @override
  Future<Either<Failure, void>> send(ContactMessage message) async {
    sent = message;
    return const Right<Failure, void>(null);
  }
}

class _MemoryHistory implements ContactHistory {
  int recorded = 0;

  @override
  Future<void> record(DateTime at) async {
    recorded += 1;
  }

  @override
  List<DateTime> sentAt() => const <DateTime>[];
}
