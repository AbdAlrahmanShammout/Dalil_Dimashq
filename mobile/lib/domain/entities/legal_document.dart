class LegalDocument {
  const LegalDocument({
    required this.id,
    required this.kind,
    required this.bodyAr,
    required this.bodyEn,
  });

  final int id;
  final String kind;
  final String bodyAr;
  final String bodyEn;
}
