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
  testWidgets('contact details render only when they are present', (
    WidgetTester tester,
  ) async {
    final _RecordingLinks links = _RecordingLinks();
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        home: PlacePage(
          placeId: '1',
          placeBloc: PlaceBloc(GetPlaceUseCase(_ContactRepository())),
          links: links,
        ),
      ),
    );
    await tester.pump();
    expect(find.text('+963111234567'), findsWidgets);
    expect(find.text('https://nawa.example'), findsOneWidget);
    expect(find.text('https://facebook.com/nawa'), findsOneWidget);
    expect(find.text('https://instagram.com/nawa'), findsOneWidget);
    expect(find.text('nawa@example.com'), findsOneWidget);
    await tester.tap(find.text('https://nawa.example'));
    expect(links.opened, 'https://nawa.example');
  });
}

class _ContactRepository extends FakePlaceRepository {
  @override
  Future<Either<Failure, PlaceDetail>> getPlace(String id) async {
    return const Right(
      PlaceDetail(
        id: '1',
        type: 'cafe',
        nameAr: 'نواة',
        phones: <String>['+963111234567'],
        website: 'https://nawa.example',
        facebook: 'https://facebook.com/nawa',
        instagram: 'https://instagram.com/nawa',
        email: 'nawa@example.com',
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
  }) async {}

  @override
  Future<void> share(String text) async {}

  @override
  Future<void> openUrl(Uri uri) async {
    opened = uri.toString();
  }
}
