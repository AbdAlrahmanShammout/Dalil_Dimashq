import 'dart:typed_data';

import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as image;
import 'package:dalil_dimashq/data/datasource/image_photo_compressor.dart';
import 'package:dalil_dimashq/domain/entities/picked_photo.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_photo_repository.dart';
import 'package:dalil_dimashq/domain/usecase/upload_place_photo_use_case.dart';

void main() {
  test('the long edge is reduced before the photo is uploaded', () async {
    final image.Image source = image.Image(width: 2000, height: 1000);
    final List<int> bytes = image.encodeJpg(source);
    final _Uploads uploads = _Uploads();
    await UploadPlacePhotoUseCase(const ImagePhotoCompressor(), uploads)(
      placeId: 'p1',
      photo: PickedPhoto(
        name: 'cover.jpg',
        bytes: bytes,
        width: 2000,
        height: 1000,
      ),
    );
    final image.Image? uploaded = image.decodeJpg(
      Uint8List.fromList(uploads.bytes ?? const <int>[]),
    );
    expect(uploaded?.width, ImagePhotoCompressor.maxLongEdge);
    expect(uploads.bytes!.length, lessThan(bytes.length));
  });
}

class _Uploads implements PlacePhotoRepository {
  List<int>? bytes;

  @override
  Future<Either<Failure, void>> upload({
    required String placeId,
    required String name,
    required List<int> bytes,
  }) async {
    this.bytes = bytes;
    return const Right<Failure, void>(null);
  }
}
