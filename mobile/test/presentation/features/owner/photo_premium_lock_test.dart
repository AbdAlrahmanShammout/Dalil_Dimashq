import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/picked_photo.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_photo_repository.dart';
import 'package:dalil_dimashq/domain/repositories/premium_repository.dart';
import 'package:dalil_dimashq/domain/services/photo_compressor.dart';
import 'package:dalil_dimashq/domain/services/photo_picker.dart';
import 'package:dalil_dimashq/domain/usecase/pick_place_photo_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/upload_place_photo_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_photo_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/place_photos_page.dart';

void main() {
  testWidgets('a non-Premium owner sees Contact us and no upload tools', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: PlacePhotosPage(
          placeId: 'p1',
          isPremium: false,
          bloc: PlacePhotoBloc(
            PickPlacePhotoUseCase(const _Premium(), _Picker()),
            UploadPlacePhotoUseCase(_Pass(), _Uploads()),
          ),
          onContact: (BuildContext context) {
            Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (BuildContext context) => const Scaffold(
                  body: Text('Contact us', key: Key('contact-opened')),
                ),
              ),
            );
          },
        ),
      ),
    );
    await tester.pump();
    expect(find.byKey(const Key('pick-camera')), findsNothing);
    expect(find.byKey(const Key('photo-premium-lock')), findsOneWidget);
    await tester.tap(find.byKey(const Key('photo-contact')));
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('contact-opened')), findsOneWidget);
  });
}

class _Premium implements PremiumRepository {
  const _Premium();

  @override
  Future<Either<Failure, PremiumStatus>> load(DateTime now) async {
    return const Right<Failure, PremiumStatus>(
      PremiumStatus(isActive: false, pendingRequests: 0),
    );
  }
}

class _Picker implements PhotoPicker {
  @override
  Future<PickedPhoto?> pick(PhotoOrigin origin) async => null;
}

class _Pass implements PhotoCompressor {
  @override
  List<int> compress(List<int> bytes) => bytes;
}

class _Uploads implements PlacePhotoRepository {
  @override
  Future<Either<Failure, void>> delete(int photoId) async =>
      const Right<Failure, void>(null);

  @override
  Future<Either<Failure, void>> setCover({
    required String placeId,
    required int photoId,
  }) async => const Right<Failure, void>(null);

  @override
  Future<Either<Failure, void>> setLogo({
    required String placeId,
    required int photoId,
  }) async => const Right<Failure, void>(null);

  @override
  Future<Either<Failure, void>> upload({
    required String placeId,
    required String name,
    required List<int> bytes,
  }) async => const Right<Failure, void>(null);
}
