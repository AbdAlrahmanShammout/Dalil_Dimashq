bool isPlaceLinkCode(String code) {
  final String value = code.trim();
  return value.startsWith('DD-') && value.length > 3;
}
