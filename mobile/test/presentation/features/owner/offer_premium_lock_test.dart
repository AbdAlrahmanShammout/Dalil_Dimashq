import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/owner_offer.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_offer_repository.dart';
import 'package:dalil_dimashq/domain/repositories/premium_repository.dart';
import 'package:dalil_dimashq/domain/usecase/manage_owner_offer_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/owner_offers_page.dart';

void main() {
  testWidgets('a non-Premium owner sees Contact us and no offer tools', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: OwnerOffersPage(
          placeId: 'p1',
          isPremium: false,
          now: DateTime.utc(2026, 10, 24),
          manage: ManageOwnerOfferUseCase(const _Premium(), _Offers()),
          onContact: (BuildContext context) {
            Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (BuildContext context) => const Scaffold(
                  body: Text('Contact us', key: Key('contact-opened')),
                ),
              ),
            );
          },
        ),
      ),
    );
    expect(find.byKey(const Key('create-offer')), findsNothing);
    expect(find.byKey(const Key('offer-premium-lock')), findsOneWidget);
    await tester.tap(find.byKey(const Key('offer-contact')));
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('contact-opened')), findsOneWidget);
  });
}

class _Premium implements PremiumRepository {
  const _Premium();

  @override
  Future<Either<Failure, PremiumStatus>> load(DateTime now) async {
    return const Right<Failure, PremiumStatus>(
      PremiumStatus(isActive: false, pendingRequests: 0),
    );
  }
}

class _Offers implements OwnerOfferRepository {
  @override
  Future<Either<Failure, void>> create({
    required String placeId,
    required OwnerOffer offer,
  }) async => const Right<Failure, void>(null);

  @override
  Future<Either<Failure, void>> delete(int offerId) async =>
      const Right<Failure, void>(null);

  @override
  Future<Either<Failure, void>> stop({
    required int offerId,
    required DateTime endsAt,
  }) async => const Right<Failure, void>(null);
}
