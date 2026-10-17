abstract class PlaceLinks {
  Future<void> call(String phone);

  Future<void> openDirections({
    required double latitude,
    required double longitude,
  });

  Future<void> share(String text);

  Future<void> copyPhone(String phone);

  Future<void> openUrl(Uri uri);
}
