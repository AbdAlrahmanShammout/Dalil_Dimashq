class SignUpRequest {
  const SignUpRequest({
    required this.email,
    required this.password,
    required this.displayName,
  });

  final String email;
  final String password;
  final String displayName;
}
