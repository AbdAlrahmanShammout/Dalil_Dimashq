import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/picked_photo.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/premium_repository.dart';
import 'package:dalil_dimashq/domain/services/photo_picker.dart';
import 'package:dalil_dimashq/domain/repositories/place_photo_repository.dart';
import 'package:dalil_dimashq/domain/services/photo_compressor.dart';
import 'package:dalil_dimashq/domain/usecase/pick_place_photo_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/upload_place_photo_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_photo_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/place_photos_page.dart';

void main() {
  testWidgets('a Premium owner can pick a photo from the camera or gallery', (
    WidgetTester tester,
  ) async {
    final _Picker picker = _Picker();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: PlacePhotosPage(
          placeId: 'p1',
          isPremium: true,
          bloc: PlacePhotoBloc(
            PickPlacePhotoUseCase(const _Premium(), picker),
            UploadPlacePhotoUseCase(_PassThrough(), _Uploads()),
          ),
        ),
      ),
    );
    await tester.pump();
    await tester.tap(find.byKey(const Key('pick-camera')));
    await tester.pump();
    expect(picker.origin, PhotoOrigin.camera);
    await tester.tap(find.byKey(const Key('pick-gallery')));
    await tester.pump();
    expect(picker.origin, PhotoOrigin.gallery);
    expect(find.byKey(const Key('picked-photo')), findsOneWidget);
  });
}

class _Premium implements PremiumRepository {
  const _Premium();

  @override
  Future<Either<Failure, PremiumStatus>> load(DateTime now) async {
    return Right<Failure, PremiumStatus>(
      PremiumStatus(
        isActive: true,
        pendingRequests: 0,
        endsAt: DateTime.utc(2026, 12, 1),
      ),
    );
  }
}

class _PassThrough implements PhotoCompressor {
  @override
  List<int> compress(List<int> bytes) => bytes;
}

class _Uploads implements PlacePhotoRepository {
  @override
  Future<Either<Failure, void>> upload({
    required String placeId,
    required String name,
    required List<int> bytes,
  }) async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> setCover({
    required String placeId,
    required int photoId,
  }) async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> setLogo({
    required String placeId,
    required int photoId,
  }) async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> delete(int photoId) async {
    return const Right<Failure, void>(null);
  }
}

class _Picker implements PhotoPicker {
  PhotoOrigin? origin;

  @override
  Future<PickedPhoto?> pick(PhotoOrigin origin) async {
    this.origin = origin;
    return PickedPhoto(
      name: origin.name,
      bytes: const <int>[1, 2, 3],
      width: 10,
      height: 10,
    );
  }
}
