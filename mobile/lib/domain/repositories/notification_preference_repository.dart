abstract class NotificationPreferenceRepository {
  bool isEnabled();

  Future<void> setEnabled(bool isEnabled);
}

bool shouldRequestNotificationPermission(
  NotificationPreferenceRepository repository,
) {
  return repository.isEnabled();
}
