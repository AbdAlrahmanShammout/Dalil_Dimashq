import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_photo.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_bloc.dart';
import 'package:dalil_dimashq/presentation/features/place/pages/place_page.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('a photo opens the gallery', (WidgetTester tester) async {
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        home: PlacePage(
          placeId: '1',
          placeBloc: PlaceBloc(GetPlaceUseCase(_PhotoRepository())),
          links: _SilentLinks(),
        ),
      ),
    );
    await tester.pump();
    await tester.tap(find.byKey(const Key('place-photo-3')));
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('gallery-page')), findsOneWidget);
    expect(find.text('front.jpg'), findsOneWidget);
  });
}

class _PhotoRepository extends FakePlaceRepository {
  @override
  Future<Either<Failure, PlaceDetail>> getPlace(String id) async {
    return const Right(
      PlaceDetail(
        id: '1',
        type: 'cafe',
        nameAr: 'نواة',
        photos: <PlacePhoto>[
          PlacePhoto(id: 3, storagePath: 'front.jpg'),
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
