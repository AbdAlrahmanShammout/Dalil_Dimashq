import 'package:dalil_dimashq/domain/services/device_location.dart';
import 'package:geolocator/geolocator.dart';
import 'package:injectable/injectable.dart';

@LazySingleton(as: DeviceLocation)
class GeolocatorDeviceLocation implements DeviceLocation {
  @override
  Future<bool> requestPermission() async {
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    return permission == LocationPermission.always ||
        permission == LocationPermission.whileInUse;
  }

  @override
  Future<GeoPoint?> currentPosition() async {
    final Position position = await Geolocator.getCurrentPosition();
    return GeoPoint(latitude: position.latitude, longitude: position.longitude);
  }
}
