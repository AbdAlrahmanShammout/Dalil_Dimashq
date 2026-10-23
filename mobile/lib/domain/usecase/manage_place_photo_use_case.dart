import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_photo_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ManagePlacePhotoUseCase {
  ManagePlacePhotoUseCase(this._repository);

  final PlacePhotoRepository _repository;

  Future<Either<Failure, void>> cover({
    required String placeId,
    required int photoId,
  }) {
    return _repository.setCover(placeId: placeId, photoId: photoId);
  }

  Future<Either<Failure, void>> logo({
    required String placeId,
    required int photoId,
  }) {
    return _repository.setLogo(placeId: placeId, photoId: photoId);
  }

  Future<Either<Failure, void>> delete(int photoId) => _repository.delete(photoId);
}
