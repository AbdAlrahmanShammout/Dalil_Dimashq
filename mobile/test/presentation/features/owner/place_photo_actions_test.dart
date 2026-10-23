import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_photo_repository.dart';
import 'package:dalil_dimashq/domain/usecase/manage_place_photo_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/widgets/place_photo_actions.dart';

void main() {
  testWidgets('the owner can set the cover, the logo, and delete a photo', (
    WidgetTester tester,
  ) async {
    final _Photos photos = _Photos();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: PlacePhotoActions(
            placeId: 'p1',
            photoId: 7,
            manage: ManagePlacePhotoUseCase(photos),
          ),
        ),
      ),
    );
    await tester.tap(find.byKey(const Key('set-cover')));
    await tester.tap(find.byKey(const Key('set-logo')));
    await tester.tap(find.byKey(const Key('delete-photo')));
    await tester.pump();
    expect(photos.cover, 7);
    expect(photos.logo, 7);
    expect(photos.deleted, 7);
  });
}

class _Photos implements PlacePhotoRepository {
  int? cover;
  int? logo;
  int? deleted;

  @override
  Future<Either<Failure, void>> delete(int photoId) async {
    deleted = photoId;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> setCover({
    required String placeId,
    required int photoId,
  }) async {
    cover = photoId;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> setLogo({
    required String placeId,
    required int photoId,
  }) async {
    logo = photoId;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> upload({
    required String placeId,
    required String name,
    required List<int> bytes,
  }) async {
    return const Right<Failure, void>(null);
  }
}
