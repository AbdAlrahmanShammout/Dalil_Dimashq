abstract class RecoveryEvent {
  const RecoveryEvent();
}

class RecoverySubmitted extends RecoveryEvent {
  const RecoverySubmitted(this.email);

  final String email;
}
