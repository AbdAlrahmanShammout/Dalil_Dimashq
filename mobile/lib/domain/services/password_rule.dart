const int minimumPasswordLength = 10;

bool isAcceptablePassword(String password) {
  if (password.length < minimumPasswordLength) {
    return false;
  }
  final bool hasLetter = RegExp(r'\p{L}', unicode: true).hasMatch(password);
  final bool hasDigit = RegExp(r'\d').hasMatch(password);
  return hasLetter && hasDigit;
}
