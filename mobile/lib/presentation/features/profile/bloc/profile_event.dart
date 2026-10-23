abstract class ProfileEvent {
  const ProfileEvent();
}

class ProfileStarted extends ProfileEvent {
  const ProfileStarted();
}

class ProfileSubmitted extends ProfileEvent {
  const ProfileSubmitted({
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.birthYearText,
    required this.language,
  });

  final String firstName;
  final String lastName;
  final String phone;
  final String birthYearText;
  final String language;
}
