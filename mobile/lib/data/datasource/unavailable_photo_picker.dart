import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/picked_photo.dart';
import 'package:dalil_dimashq/domain/services/photo_picker.dart';

@LazySingleton(as: PhotoPicker)
class UnavailablePhotoPicker implements PhotoPicker {
  const UnavailablePhotoPicker();

  @override
  Future<PickedPhoto?> pick(PhotoOrigin origin) async => null;
}
