import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_bloc.dart';
import 'package:dalil_dimashq/presentation/features/place/pages/place_page.dart';
import 'package:dartz/dartz.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('the place header shows cover, logo, names, and stars', (
    WidgetTester tester,
  ) async {
    final _HeaderRepository repository = _HeaderRepository();
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        home: PlacePage(
          placeId: '1',
          placeBloc: PlaceBloc(GetPlaceUseCase(repository)),
        ),
      ),
    );
    await tester.pump();
    expect(find.byKey(const Key('place-cover')), findsOneWidget);
    expect(find.byKey(const Key('place-logo')), findsOneWidget);
    expect(find.text('بيت الوالي'), findsOneWidget);
    expect(find.text('Beit Al Wali'), findsOneWidget);
    expect(find.text('hotel'), findsOneWidget);
    expect(find.text('Shaalan'), findsOneWidget);
    expect(find.text('Featured'), findsOneWidget);
    expect(find.text('4 · Hotel class'), findsOneWidget);
  });
}

class _HeaderRepository extends FakePlaceRepository {
  @override
  Future<Either<Failure, PlaceDetail>> getPlace(String id) async {
    return const Right(
      PlaceDetail(
        id: '1',
        type: 'hotel',
        nameAr: 'بيت الوالي',
        nameEn: 'Beit Al Wali',
        areaNameAr: 'الشعلان',
        areaNameEn: 'Shaalan',
        stars: 4,
        starSource: StarSource.hotelClass,
        isFeatured: true,
        coverPath: 'cover.jpg',
        logoPath: 'logo.jpg',
      ),
    );
  }
}
