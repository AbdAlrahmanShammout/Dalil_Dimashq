import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/picked_photo.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_photo_repository.dart';
import 'package:dalil_dimashq/domain/services/photo_compressor.dart';
import 'package:injectable/injectable.dart';

@injectable
class UploadPlacePhotoUseCase {
  UploadPlacePhotoUseCase(this._compressor, this._repository);

  final PhotoCompressor _compressor;
  final PlacePhotoRepository _repository;

  Future<Either<Failure, void>> call({
    required String placeId,
    required PickedPhoto photo,
  }) {
    final List<int> bytes = _compressor.compress(photo.bytes);
    return _repository.upload(placeId: placeId, name: photo.name, bytes: bytes);
  }
}
