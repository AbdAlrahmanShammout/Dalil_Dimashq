class OwnedPlace {
  const OwnedPlace({
    required this.id,
    required this.nameAr,
    required this.type,
    this.nameEn,
    this.address,
  });

  final String id;
  final String nameAr;
  final String? nameEn;
  final String type;
  final String? address;
}
