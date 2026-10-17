import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_offer.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_bloc.dart';
import 'package:dalil_dimashq/presentation/features/place/pages/place_page.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('current offers show title, details, image, and until date', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        home: PlacePage(
          placeId: '1',
          now: DateTime.utc(2026, 10, 17, 12),
          placeBloc: PlaceBloc(GetPlaceUseCase(_OfferRepository())),
          links: _SilentLinks(),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Lunch deal'), findsOneWidget);
    expect(find.text('Half price before 4'), findsOneWidget);
    expect(find.textContaining('2026'), findsOneWidget);
    expect(find.byKey(const Key('place-offer-7')), findsOneWidget);
    expect(find.text('Old deal'), findsNothing);
  });
}

class _OfferRepository extends FakePlaceRepository {
  @override
  Future<Either<Failure, PlaceDetail>> getPlace(String id) async {
    return Right(
      PlaceDetail(
        id: '1',
        type: 'cafe',
        nameAr: 'نواة',
        offers: <PlaceOffer>[
          PlaceOffer(
            id: 7,
            titleAr: 'عرض الغداء',
            titleEn: 'Lunch deal',
            detailsEn: 'Half price before 4',
            startsAt: DateTime.utc(2026, 10, 1),
            endsAt: DateTime.utc(2026, 12, 31),
            photoPath: 'offer.jpg',
          ),
          PlaceOffer(
            id: 8,
            titleAr: 'قديم',
            titleEn: 'Old deal',
            endsAt: DateTime.utc(2026, 1, 1),
          ),
        ],
      ),
    );
  }
}

class _SilentLinks implements PlaceLinks {
  @override
  Future<void> call(String phone) async {}

  @override
  Future<void> copyPhone(String phone) async {}

  @override
  Future<void> openDirections({
    required double latitude,
    required double longitude,
  }) async {}

  @override
  Future<void> share(String text) async {}

  @override
  Future<void> openUrl(Uri uri) async {}
}
