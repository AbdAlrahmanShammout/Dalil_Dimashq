import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/amenity.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_bloc.dart';
import 'package:dalil_dimashq/presentation/features/place/pages/place_page.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('overview shows the description and amenity chips', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        home: PlacePage(
          placeId: '1',
          placeBloc: PlaceBloc(GetPlaceUseCase(_OverviewRepository())),
          links: _SilentLinks(),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('A small cafe in Shaalan'), findsOneWidget);
    expect(find.text('Wifi'), findsOneWidget);
    expect(find.text('واي فاي'), findsNothing);
  });
}

class _OverviewRepository extends FakePlaceRepository {
  @override
  Future<Either<Failure, PlaceDetail>> getPlace(String id) async {
    return const Right(
      PlaceDetail(
        id: '1',
        type: 'cafe',
        nameAr: 'نواة',
        descriptionEn: 'A small cafe in Shaalan',
        descriptionAr: 'مقهى صغير في الشعلان',
        amenities: <Amenity>[
          Amenity(code: 'wifi', nameAr: 'واي فاي', nameEn: 'Wifi'),
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
}
