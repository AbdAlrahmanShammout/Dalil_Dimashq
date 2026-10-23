abstract class LegalEvent {
  const LegalEvent();
}

class LegalStarted extends LegalEvent {
  const LegalStarted();
}

class LegalAccepted extends LegalEvent {
  const LegalAccepted(this.documentId);

  final int documentId;
}
