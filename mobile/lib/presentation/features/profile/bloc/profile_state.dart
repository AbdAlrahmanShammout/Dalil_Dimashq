class ProfileState {
  const ProfileState({
    this.displayName = '',
    this.phone = '',
    this.isLoading = false,
    this.isSaved = false,
  });

  final String displayName;
  final String phone;
  final bool isLoading;
  final bool isSaved;

  ProfileState copyWith({
    String? displayName,
    String? phone,
    bool? isLoading,
    bool? isSaved,
  }) {
    return ProfileState(
      displayName: displayName ?? this.displayName,
      phone: phone ?? this.phone,
      isLoading: isLoading ?? this.isLoading,
      isSaved: isSaved ?? this.isSaved,
    );
  }
}
