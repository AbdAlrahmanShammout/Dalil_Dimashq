class SiteContact {
  const SiteContact({required this.key, required this.value});

  final String key;
  final String value;

  bool get isVisible => value.trim().isNotEmpty;
}
