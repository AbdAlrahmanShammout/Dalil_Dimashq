class UserProfile {
  const UserProfile({
    this.displayName = '',
    this.firstName = '',
    this.lastName = '',
    this.phone = '',
    this.birthYear,
    this.language = 'ar',
    this.isComplete = false,
    this.hasPendingChange = false,
  });

  final String displayName;
  final String firstName;
  final String lastName;
  final String phone;
  final int? birthYear;
  final String language;
  final bool isComplete;
  final bool hasPendingChange;
}

class ProfileDraft {
  const ProfileDraft({
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.birthYear,
    required this.language,
  });

  final String firstName;
  final String lastName;
  final String phone;
  final int birthYear;
  final String language;
}
