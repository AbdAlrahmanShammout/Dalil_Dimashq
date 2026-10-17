import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_hour.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_bloc.dart';
import 'package:dalil_dimashq/presentation/features/place/pages/place_page.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('weekly hours and Open now use Damascus time', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        home: PlacePage(
          placeId: '1',
          now: DateTime.utc(2026, 10, 19, 10, 30),
          placeBloc: PlaceBloc(GetPlaceUseCase(_HoursRepository())),
          links: _SilentLinks(),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Open now'), findsOneWidget);
    expect(find.text('Monday 09:00–17:00'), findsOneWidget);
    expect(find.text('Closed now'), findsNothing);
  });
}

class _HoursRepository extends FakePlaceRepository {
  @override
  Future<Either<Failure, PlaceDetail>> getPlace(String id) async {
    return const Right(
      PlaceDetail(
        id: '1',
        type: 'cafe',
        nameAr: 'نواة',
        hours: <PlaceHour>[
          PlaceHour(weekday: 1, opens: '09:00:00', closes: '17:00:00'),
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
