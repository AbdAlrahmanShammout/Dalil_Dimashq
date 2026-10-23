import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/premium_repository.dart';
import 'package:dalil_dimashq/domain/usecase/load_premium_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/premium_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/owner_gate_page.dart';

void main() {
  test('premium is active only while the subscription end is in the future', () {
    final DateTime now = DateTime.utc(2026, 10, 24);
    final PremiumStatus active = resolvePremiumStatus(
      endsAt: <DateTime?>[
        DateTime.utc(2026, 10, 1),
        DateTime.utc(2026, 11, 8),
      ],
      pendingRequests: 2,
      now: now,
    );
    expect(active.isActive, isTrue);
    expect(active.endDate, '2026-11-08');
    expect(active.pendingRequests, 2);
    final PremiumStatus ended = resolvePremiumStatus(
      endsAt: <DateTime?>[DateTime.utc(2026, 10, 1)],
      pendingRequests: 0,
      now: now,
    );
    expect(ended.isActive, isFalse);
  });

  testWidgets('the owner sees the premium end date and pending requests', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: OwnerGatePage(
          hasSession: true,
          now: DateTime.utc(2026, 10, 24),
          premium: PremiumBloc(LoadPremiumUseCase(_Premium())),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Premium until 2026-11-08'), findsOneWidget);
    expect(find.text('2 pending requests'), findsOneWidget);
  });
}

class _Premium implements PremiumRepository {
  @override
  Future<Either<Failure, PremiumStatus>> load(DateTime now) async {
    return Right<Failure, PremiumStatus>(
      resolvePremiumStatus(
        endsAt: <DateTime?>[DateTime.utc(2026, 11, 8)],
        pendingRequests: 2,
        now: now,
      ),
    );
  }
}
