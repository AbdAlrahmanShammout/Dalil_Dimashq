class PlaceChangeRequest {
  const PlaceChangeRequest({
    required this.id,
    required this.kind,
    required this.status,
    this.decisionNote,
  });

  final int id;
  final String kind;
  final String status;
  final String? decisionNote;

  bool get isAccepted => status == 'approved';
}
