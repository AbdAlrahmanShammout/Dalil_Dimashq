import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/amenity.dart';
import 'package:dalil_dimashq/domain/entities/owner_amenities.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_amenity_repository.dart';
import 'package:dalil_dimashq/domain/usecase/load_owner_amenities_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/toggle_amenity_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_amenities_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/owner_amenities_page.dart';

void main() {
  testWidgets('the owner adds and removes an amenity from the catalog', (
    WidgetTester tester,
  ) async {
    final _Amenities amenities = _Amenities();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: OwnerAmenitiesPage(
          placeId: 'p1',
          bloc: OwnerAmenitiesBloc(
            LoadOwnerAmenitiesUseCase(amenities),
            ToggleAmenityUseCase(amenities),
          ),
        ),
      ),
    );
    await tester.pump();
    await tester.tap(find.byKey(const Key('amenity-wifi')));
    await tester.pump();
    expect(amenities.added, 'wifi');
    await tester.tap(find.byKey(const Key('amenity-wifi')));
    await tester.pump();
    expect(amenities.removed, 'wifi');
  });
}

class _Amenities implements OwnerAmenityRepository {
  String? added;
  String? removed;

  @override
  Future<Either<Failure, void>> add({
    required String placeId,
    required String code,
  }) async {
    added = code;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, OwnerAmenities>> load(String placeId) async {
    return const Right<Failure, OwnerAmenities>(
      OwnerAmenities(
        catalog: <Amenity>[
          Amenity(code: 'wifi', nameAr: 'واي فاي', nameEn: 'Wi-Fi'),
        ],
        selected: <String>[],
      ),
    );
  }

  @override
  Future<Either<Failure, void>> remove({
    required String placeId,
    required String code,
  }) async {
    removed = code;
    return const Right<Failure, void>(null);
  }
}
