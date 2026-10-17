class SignUpRequest {
  const SignUpRequest({
    required this.email,
    required this.password,
    required this.displayName,
    required this.isAtLeast16,
  });

  final String email;
  final String password;
  final String displayName;
  final bool isAtLeast16;
}
