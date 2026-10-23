const List<String> placeTypes = <String>[
  'restaurant',
  'fast_food',
  'cafe',
  'hotel',
  'guest_house',
  'hostel',
  'motel',
];

class ReviewedPlaceChanges {
  const ReviewedPlaceChanges({
    this.nameAr,
    this.nameEn,
    this.type,
    this.address,
    this.tourismClass,
  });

  final String? nameAr;
  final String? nameEn;
  final String? type;
  final String? address;
  final int? tourismClass;

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      if (nameAr != null && nameAr!.isNotEmpty) 'name_ar': nameAr,
      if (nameEn != null && nameEn!.isNotEmpty) 'name_en': nameEn,
      if (type != null && type!.isNotEmpty) 'type': type,
      if (address != null && address!.isNotEmpty) 'address': address,
      if (tourismClass != null) 'tourism_class': tourismClass,
    };
  }
}
