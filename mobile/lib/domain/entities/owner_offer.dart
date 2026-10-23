class OwnerOffer {
  const OwnerOffer({
    required this.titleAr,
    required this.detailsAr,
    required this.startsAt,
    required this.endsAt,
    this.photoPath,
  });

  static const int maxDays = 60;

  final String titleAr;
  final String detailsAr;
  final DateTime startsAt;
  final DateTime endsAt;
  final String? photoPath;

  bool get fitsWindow =>
      endsAt.isAfter(startsAt) && endsAt.difference(startsAt).inDays <= maxDays;
}
