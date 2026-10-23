import 'package:dalil_dimashq/domain/entities/picked_photo.dart';

abstract class PhotoPicker {
  Future<PickedPhoto?> pick(PhotoOrigin origin);
}
