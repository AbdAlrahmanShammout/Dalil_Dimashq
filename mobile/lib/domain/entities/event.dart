class Event {
  const Event({
    required this.id,
    required this.titleAr,
    required this.venueName,
    required this.startsAt,
    this.titleEn,
    this.posterPath,
    this.descriptionAr,
    this.descriptionEn,
    this.venueAddress,
    this.contactPhone,
    this.placeId,
    this.endsAt,
    this.publishFrom,
    this.status = 'published',
  });

  final int id;
  final String titleAr;
  final String? titleEn;
  final String venueName;
  final DateTime startsAt;
  final String? posterPath;
  final String? descriptionAr;
  final String? descriptionEn;
  final String? venueAddress;
  final String? contactPhone;
  final String? placeId;
  final DateTime? endsAt;
  final DateTime? publishFrom;
  final String status;
}

List<Event> visibleEvents(List<Event> events, DateTime now) {
  return events.where((Event event) {
    final bool published = event.status == 'published';
    final bool released =
        event.publishFrom == null || !now.isBefore(event.publishFrom!);
    final bool notFinished = event.endsAt == null || now.isBefore(event.endsAt!);
    return published && released && notFinished;
  }).toList();
}
