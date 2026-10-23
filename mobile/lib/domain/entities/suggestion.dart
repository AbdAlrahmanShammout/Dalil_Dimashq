class Suggestion {
  const Suggestion({
    required this.name,
    required this.contact,
    required this.message,
    this.placeId,
  });

  final String name;
  final String contact;
  final String message;
  final String? placeId;

  /// Allowed `kind` values. Empty until the client confirms them.
  static const List<String> kinds = <String>[];
}
