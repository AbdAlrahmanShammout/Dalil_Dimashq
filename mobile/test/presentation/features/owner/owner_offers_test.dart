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
  final DateTime now = DateTime.utc(2026, 10, 24);

  testWidgets('a Premium owner creates, stops, and deletes an offer', (
    WidgetTester tester,
  ) async {
    final _Offers offers = _Offers();
    await tester.pumpWidget(_page(offers, now, offerId: 4));
    await tester.enterText(find.byKey(const Key('offer-title')), 'قهوة');
    await tester.enterText(find.byKey(const Key('offer-details')), 'خصم');
    await tester.enterText(find.byKey(const Key('offer-days')), '90');
    await tester.tap(find.byKey(const Key('create-offer')));
    await tester.pump();
    expect(offers.created, isNull);
    expect(find.byKey(const Key('offer-too-long')), findsOneWidget);
    await tester.enterText(find.byKey(const Key('offer-days')), '10');
    await tester.enterText(find.byKey(const Key('offer-photo')), 'p1/offer.jpg');
    await tester.tap(find.byKey(const Key('create-offer')));
    await tester.pump();
    expect(offers.created?.titleAr, 'قهوة');
    expect(offers.created?.detailsAr, 'خصم');
    expect(offers.created?.photoPath, 'p1/offer.jpg');
    await tester.tap(find.byKey(const Key('stop-offer')));
    await tester.pump();
    expect(offers.stopped, now);
    await tester.tap(find.byKey(const Key('delete-offer')));
    await tester.pump();
    expect(offers.deleted, 4);
  });
}

Widget _page(_Offers offers, DateTime now, {int? offerId}) {
  return MaterialApp(
    locale: const Locale('en'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: OwnerOffersPage(
      placeId: 'p1',
      offerId: offerId,
      now: now,
      isPremium: true,
      manage: ManageOwnerOfferUseCase(const _Premium(), offers),
    ),
  );
}

class _Premium implements PremiumRepository {
  const _Premium();

  @override
  Future<Either<Failure, PremiumStatus>> load(DateTime now) async {
    return Right<Failure, PremiumStatus>(
      PremiumStatus(
        isActive: true,
        pendingRequests: 0,
        endsAt: DateTime.utc(2026, 12, 1),
      ),
    );
  }
}

class _Offers implements OwnerOfferRepository {
  OwnerOffer? created;
  DateTime? stopped;
  int? deleted;

  @override
  Future<Either<Failure, void>> create({
    required String placeId,
    required OwnerOffer offer,
  }) async {
    created = offer;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> delete(int offerId) async {
    deleted = offerId;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> stop({
    required int offerId,
    required DateTime endsAt,
  }) async {
    stopped = endsAt;
    return const Right<Failure, void>(null);
  }
}
