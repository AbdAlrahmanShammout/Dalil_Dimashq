import 'package:dalil_dimashq/domain/entities/amenity.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/entities/place_hour.dart';
import 'package:dalil_dimashq/domain/entities/place_offer.dart';
import 'package:dalil_dimashq/domain/entities/place_photo.dart';

class PlaceDetail {
  const PlaceDetail({
    required this.id,
    required this.type,
    required this.nameAr,
    this.nameEn,
    this.areaNameAr,
    this.areaNameEn,
    this.stars,
    this.starSource,
    this.isFeatured = false,
    this.coverPath,
    this.logoPath,
    this.phones = const <String>[],
    this.latitude,
    this.longitude,
    this.offers = const <PlaceOffer>[],
    this.photos = const <PlacePhoto>[],
    this.descriptionAr,
    this.descriptionEn,
    this.amenities = const <Amenity>[],
    this.hours = const <PlaceHour>[],
    this.website,
    this.email,
    this.facebook,
    this.instagram,
  });

  final String id;
  final String type;
  final String nameAr;
  final String? nameEn;
  final String? areaNameAr;
  final String? areaNameEn;
  final int? stars;
  final StarSource? starSource;
  final bool isFeatured;
  final String? coverPath;
  final String? logoPath;
  final List<String> phones;
  final double? latitude;
  final double? longitude;
  final List<PlaceOffer> offers;
  final List<PlacePhoto> photos;
  final String? descriptionAr;
  final String? descriptionEn;
  final List<Amenity> amenities;
  final List<PlaceHour> hours;
  final String? website;
  final String? email;
  final String? facebook;
  final String? instagram;
}
