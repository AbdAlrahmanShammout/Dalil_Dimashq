import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_offer.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/offer_repository.dart';
import 'package:dalil_dimashq/domain/usecase/list_offers_use_case.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/offers/bloc/offers_bloc.dart';
import 'package:dalil_dimashq/presentation/features/offers/pages/offers_page.dart';

void main() {
  testWidgets('current offers open their place', (WidgetTester tester) async {
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        home: OffersPage(
          now: DateTime.utc(2026, 10, 17),
          offersBloc: OffersBloc(ListOffersUseCase(_OffersRepository())),
          placeBuilder: (String placeId) => Text('place-$placeId'),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Lunch deal'), findsOneWidget);
    expect(find.text('Old deal'), findsNothing);
    await tester.tap(find.byKey(const Key('offer-7')));
    await tester.pumpAndSettle();
    expect(find.text('place-nawa'), findsOneWidget);
  });
}

class _OffersRepository implements OfferRepository {
  @override
  Future<Either<Failure, List<PlaceOffer>>> list() async {
    return Right(<PlaceOffer>[
      PlaceOffer(
        id: 7,
        titleAr: 'عرض الغداء',
        titleEn: 'Lunch deal',
        placeId: 'nawa',
        startsAt: DateTime.utc(2026, 10, 1),
        endsAt: DateTime.utc(2026, 12, 31),
      ),
      PlaceOffer(
        id: 8,
        titleAr: 'قديم',
        titleEn: 'Old deal',
        placeId: 'old',
        endsAt: DateTime.utc(2026, 1, 1),
      ),
    ]);
  }
}
