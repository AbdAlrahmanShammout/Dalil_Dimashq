import 'package:dalil_dimashq/data/dto/area_dto.dart';
import 'package:dalil_dimashq/data/dto/photo_dto.dart';
import 'package:dalil_dimashq/data/dto/place_row_dto.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';

PlaceDetail mapPlaceHeader({
  required PlaceRowDto place,
  AreaDto? area,
  required bool isFeatured,
  String? coverPath,
  String? logoPath,
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
