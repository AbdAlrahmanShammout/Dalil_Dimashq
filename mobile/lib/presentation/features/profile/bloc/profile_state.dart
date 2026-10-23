import 'package:dalil_dimashq/domain/entities/user_profile.dart';

class ProfileState {
  const ProfileState({
    this.profile = const UserProfile(),
    this.isLoading = false,
    this.isSaved = false,
    this.errorCode,
  });

  final UserProfile profile;
  final bool isLoading;
  final bool isSaved;
  final String? errorCode;

  ProfileState copyWith({
    UserProfile? profile,
    bool? isLoading,
    bool? isSaved,
    String? errorCode,
    bool clearError = false,
  }) {
    return ProfileState(
      profile: profile ?? this.profile,
      isLoading: isLoading ?? this.isLoading,
      isSaved: isSaved ?? this.isSaved,
      errorCode: clearError ? null : errorCode ?? this.errorCode,
    );
  }
}
