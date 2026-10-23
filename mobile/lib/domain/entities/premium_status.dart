class PremiumStatus {
  const PremiumStatus({
    required this.isActive,
    required this.pendingRequests,
    this.endsAt,
  });

  final bool isActive;
  final DateTime? endsAt;
  final int pendingRequests;

  String get endDate {
    final DateTime? value = endsAt;
    if (value == null) {
      return '';
    }
    final DateTime utc = value.toUtc();
    final String month = utc.month.toString().padLeft(2, '0');
    final String day = utc.day.toString().padLeft(2, '0');
    return '${utc.year}-$month-$day';
  }
}

PremiumStatus resolvePremiumStatus({
  required List<DateTime?> endsAt,
  required int pendingRequests,
  required DateTime now,
}) {
  DateTime? latest;
  for (final DateTime? ends in endsAt) {
    if (ends == null || !ends.isAfter(now)) {
      continue;
    }
    if (latest == null || ends.isAfter(latest)) {
      latest = ends;
    }
  }
  return PremiumStatus(
    isActive: latest != null,
    endsAt: latest,
    pendingRequests: pendingRequests,
  );
}
