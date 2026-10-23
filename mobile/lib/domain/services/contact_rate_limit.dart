import 'package:dalil_dimashq/domain/entities/contact_message.dart';

bool isContactRateLimited({
  required List<DateTime> sentAt,
  required DateTime now,
}) {
  final int inLastHour = sentAt
      .where(
        (DateTime at) => now.difference(at) < const Duration(hours: 1),
      )
      .length;
  if (inLastHour >= ContactMessage.maxPerHour) {
    return true;
  }
  final DateTime today = now.toUtc().add(ContactMessage.damascusOffset);
  final int todayCount = sentAt.where((DateTime at) {
    final DateTime local = at.toUtc().add(ContactMessage.damascusOffset);
    return local.year == today.year &&
        local.month == today.month &&
        local.day == today.day;
  }).length;
  return todayCount >= ContactMessage.maxPerDay;
}
