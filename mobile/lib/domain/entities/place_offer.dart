class PlaceOffer {
  const PlaceOffer({
    required this.id,
    required this.titleAr,
    this.titleEn,
    this.detailsAr,
    this.detailsEn,
    this.startsAt,
    this.endsAt,
    this.photoPath,
  });

  final int id;
  final String titleAr;
  final String? titleEn;
  final String? detailsAr;
  final String? detailsEn;
  final DateTime? startsAt;
  final DateTime? endsAt;
  final String? photoPath;
}

List<PlaceOffer> currentOffers(List<PlaceOffer> offers, DateTime now) {
  return offers.where((PlaceOffer offer) {
    final bool started =
        offer.startsAt == null || !now.isBefore(offer.startsAt!);
    final bool stillRunning =
        offer.endsAt == null || !now.isAfter(offer.endsAt!);
    return started && stillRunning;
  }).toList();
}
