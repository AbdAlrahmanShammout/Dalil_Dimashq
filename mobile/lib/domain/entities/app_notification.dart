class AppNotification {
  const AppNotification({
    required this.id,
    required this.kind,
    this.bookingId,
    this.readAt,
  });

  final int id;
  final String kind;
  final int? bookingId;
  final DateTime? readAt;

  bool get isRead => readAt != null;
}
