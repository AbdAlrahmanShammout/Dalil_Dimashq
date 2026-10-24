const Set<String> ownerNotificationKinds = <String>{
  'booking_new',
  'booking_clock_started',
  'booking_cancelled_by_customer',
  'fake_report_new',
};

bool isOwnerNotification(String kind) => ownerNotificationKinds.contains(kind);
