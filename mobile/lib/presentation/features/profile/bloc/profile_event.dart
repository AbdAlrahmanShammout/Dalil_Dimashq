import 'package:dalil_dimashq/domain/entities/user_profile.dart';

abstract class ProfileEvent {
  const ProfileEvent();
}

class ProfileStarted extends ProfileEvent {
  const ProfileStarted();
}

class ProfileSaved extends ProfileEvent {
  const ProfileSaved(this.profile);

  final UserProfile profile;
}
