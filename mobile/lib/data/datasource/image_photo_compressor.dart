import 'dart:typed_data';

import 'package:image/image.dart' as image;
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/services/photo_compressor.dart';

@LazySingleton(as: PhotoCompressor)
class ImagePhotoCompressor implements PhotoCompressor {
  const ImagePhotoCompressor();

  static const int maxLongEdge = 1600;

  @override
  List<int> compress(List<int> bytes) {
    final image.Image? decoded = image.decodeImage(Uint8List.fromList(bytes));
    if (decoded == null) {
      return bytes;
    }
    final int longEdge = decoded.width > decoded.height
        ? decoded.width
        : decoded.height;
    if (longEdge <= maxLongEdge) {
      return bytes;
    }
    final image.Image resized = decoded.width >= decoded.height
        ? image.copyResize(decoded, width: maxLongEdge)
        : image.copyResize(decoded, height: maxLongEdge);
    return image.encodeJpg(resized, quality: 80);
  }
}
