import 'package:dalil_dimashq/data/dto/area_dto.dart';
import 'package:dalil_dimashq/data/dto/offer_dto.dart';
import 'package:dalil_dimashq/data/dto/photo_dto.dart';
import 'package:dalil_dimashq/data/dto/place_hour_dto.dart';
import 'package:dalil_dimashq/data/dto/place_row_dto.dart';
import 'package:dalil_dimashq/domain/entities/amenity.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/entities/place_photo.dart';

PlaceDetail mapPlaceHeader({
  required PlaceRowDto place,
  AreaDto? area,
  required bool isFeatured,
  String? coverPath,
  String? logoPath,
  List<OfferDto> offers = const <OfferDto>[],
  List<PhotoDto> photos = const <PhotoDto>[],
  List<Amenity> amenities = const <Amenity>[],
  List<PlaceHourDto> hours = const <PlaceHourDto>[],
  bool? openNow,
}) {
  final bool hasClass = place.tourismClass != null;
  return PlaceDetail(
    id: place.id,
    type: place.type,
    nameAr: place.nameAr,
    nameEn: place.nameEn,
    areaNameAr: area?.nameAr,
    areaNameEn: area?.nameEn,
    stars: hasClass ? place.tourismClass : place.stars,
    starSource: hasClass
        ? StarSource.hotelClass
        : place.stars == null
        ? null
        : StarSource.mapRating,
    isFeatured: isFeatured,
    coverPath: coverPath,
    logoPath: logoPath,
    phones: place.phones,
    latitude: place.lat,
    longitude: place.lon,
    offers: offers.map((OfferDto offer) => offer.toEntity()).toList(),
    photos: photos
        .map(
          (PhotoDto photo) =>
              PlacePhoto(id: photo.id, storagePath: photo.storagePath),
        )
        .toList(),
    descriptionAr: place.descriptionAr,
    descriptionEn: place.descriptionEn,
    amenities: amenities,
    hours: hours.map((PlaceHourDto hour) => hour.toEntity()).toList(),
    openNow: openNow,
    website: place.website,
    email: place.email,
    facebook: place.facebook,
    instagram: place.instagram,
  );
}

String? coverPathOf(List<PhotoDto> photos) {
  for (final PhotoDto photo in photos) {
    if (photo.isCover) {
      return photo.storagePath;
    }
  }
  return null;
}

String? logoPathOf(List<PhotoDto> photos) {
  for (final PhotoDto photo in photos) {
    if (photo.isLogo) {
      return photo.storagePath;
    }
  }
  return null;
}
