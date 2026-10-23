import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/picked_photo.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/premium_repository.dart';
import 'package:dalil_dimashq/domain/services/photo_picker.dart';
import 'package:injectable/injectable.dart';

@injectable
class PickPlacePhotoUseCase {
  PickPlacePhotoUseCase(this._premium, this._picker);

  final PremiumRepository _premium;
  final PhotoPicker _picker;

  Future<Either<Failure, PickedPhoto?>> call(
    PhotoOrigin origin, {
    DateTime? now,
  }) async {
    final Either<Failure, PremiumStatus> premium = await _premium.load(
      now ?? DateTime.now(),
    );
    final PremiumStatus status = premium.getOrElse(
      () => const PremiumStatus(isActive: false, pendingRequests: 0),
    );
    if (!status.isActive) {
      return const Left<Failure, PickedPhoto?>(
        ValidationFailure('premium_required'),
      );
    }
    return Right<Failure, PickedPhoto?>(await _picker.pick(origin));
  }
}
