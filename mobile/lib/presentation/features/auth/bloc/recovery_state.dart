enum RecoveryStatus { idle, submitting, success, failure }

class RecoveryState {
  const RecoveryState({this.status = RecoveryStatus.idle});

  final RecoveryStatus status;
}
