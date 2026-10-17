import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_bloc.dart';
import 'package:dalil_dimashq/presentation/features/place/pages/place_page.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('the map preview shows the coordinate and opens directions', (
    WidgetTester tester,
  ) async {
    final _RecordingLinks links = _RecordingLinks();
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        home: PlacePage(
          placeId: '1',
          placeBloc: PlaceBloc(GetPlaceUseCase(_MapRepository())),
          links: links,
        ),
      ),
    );
    await tester.pump();
    expect(find.text('33.5138, 36.2765'), findsOneWidget);
    await tester.tap(find.byKey(const Key('place-map-directions')));
    expect(links.opened, '33.5138,36.2765');
  });
}

class _MapRepository extends FakePlaceRepository {
  @override
  Future<Either<Failure, PlaceDetail>> getPlace(String id) async {
    return const Right(
      PlaceDetail(
        id: '1',
        type: 'cafe',
        nameAr: 'نواة',
        latitude: 33.5138,
        longitude: 36.2765,
      ),
    );
  }
}

class _RecordingLinks implements PlaceLinks {
  String? opened;

  @override
  Future<void> call(String phone) async {}

  @override
  Future<void> copyPhone(String phone) async {}

  @override
  Future<void> openDirections({
    required double latitude,
    required double longitude,
  }) async {
    opened = '$latitude,$longitude';
  }

  @override
  Future<void> share(String text) async {}
}
