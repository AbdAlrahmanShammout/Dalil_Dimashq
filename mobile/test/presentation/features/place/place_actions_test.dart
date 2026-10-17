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
  testWidgets('call, directions, share, and long press copy the phone', (
    WidgetTester tester,
  ) async {
    final _RecordingLinks links = _RecordingLinks();
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        home: PlacePage(
          placeId: '1',
          placeBloc: PlaceBloc(GetPlaceUseCase(_ActionRepository())),
          links: links,
        ),
      ),
    );
    await tester.pump();
    await tester.tap(find.byKey(const Key('place-call')));
    await tester.tap(find.byKey(const Key('place-directions')));
    await tester.tap(find.byKey(const Key('place-share')));
    await tester.longPress(find.byKey(const Key('place-phone')));
    await tester.pump();
    expect(links.calls, <String>['call:+963111234567']);
    expect(links.directions, <String>['33.5138,36.2765']);
    expect(links.shared.single, contains('نواة'));
    expect(links.shared.single, contains('+963111234567'));
    expect(links.copied, '+963111234567');
    expect(find.text('Copied'), findsOneWidget);
  });
}

class _ActionRepository extends FakePlaceRepository {
  @override
  Future<Either<Failure, PlaceDetail>> getPlace(String id) async {
    return const Right(
      PlaceDetail(
        id: '1',
        type: 'cafe',
        nameAr: 'نواة',
        nameEn: 'Nawa',
        phones: <String>['+963111234567'],
        latitude: 33.5138,
        longitude: 36.2765,
      ),
    );
  }
}

class _RecordingLinks implements PlaceLinks {
  final List<String> calls = <String>[];
  final List<String> directions = <String>[];
  final List<String> shared = <String>[];
  String? copied;

  @override
  Future<void> call(String phone) async {
    calls.add('call:$phone');
  }

  @override
  Future<void> openDirections({
    required double latitude,
    required double longitude,
  }) async {
    directions.add('$latitude,$longitude');
  }

  @override
  Future<void> share(String text) async {
    shared.add(text);
  }

  @override
  Future<void> copyPhone(String phone) async {
    copied = phone;
  }
}
