class PlaceImmediateFields {
  const PlaceImmediateFields({
    required this.phones,
    this.website,
    this.email,
    this.facebook,
    this.instagram,
    this.descriptionAr,
    this.descriptionEn,
  });

  final List<String> phones;
  final String? website;
  final String? email;
  final String? facebook;
  final String? instagram;
  final String? descriptionAr;
  final String? descriptionEn;

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'phones': phones,
      'website': website,
      'email': email,
      'facebook': facebook,
      'instagram': instagram,
      'description_ar': descriptionAr,
      'description_en': descriptionEn,
    };
  }
}
