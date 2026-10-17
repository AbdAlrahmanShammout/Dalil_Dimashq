import 'package:dalil_dimashq/core/config/app_config.dart';

String? placePhotoUrl(String? path) {
  if (path == null || path.isEmpty || AppConfig.supabaseUrl.isEmpty) {
    return null;
  }
  return '${AppConfig.supabaseUrl}/storage/v1/object/public/place-photos/$path';
}
