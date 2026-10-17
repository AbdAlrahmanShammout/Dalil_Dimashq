import 'package:dalil_dimashq/data/dto/area_dto.dart';
import 'package:dalil_dimashq/data/dto/photo_dto.dart';
import 'package:dalil_dimashq/data/dto/place_row_dto.dart';
import 'package:dalil_dimashq/data/repository/place_detail_mapper.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('tourism class becomes the hotel class label source', () {
    final detail = mapPlaceHeader(
      place: const PlaceRowDto(
        id: '1',
        type: 'hotel',
        nameAr: 'بيت الوالي',
        nameEn: 'Beit Al Wali',
        areaId: 1,
        stars: 3,
        tourismClass: 4,
      ),
      area: const AreaDto(id: 1, nameAr: 'الشعلان', nameEn: 'Shaalan'),
      isFeatured: true,
      coverPath: coverPathOf(const <PhotoDto>[
        PhotoDto(storagePath: 'cover.jpg', isCover: true),
        PhotoDto(storagePath: 'logo.jpg', isLogo: true),
      ]),
      logoPath: logoPathOf(const <PhotoDto>[
        PhotoDto(storagePath: 'cover.jpg', isCover: true),
        PhotoDto(storagePath: 'logo.jpg', isLogo: true),
      ]),
    );
    expect(detail.stars, 4);
    expect(detail.starSource, StarSource.hotelClass);
    expect(detail.areaNameEn, 'Shaalan');
    expect(detail.isFeatured, isTrue);
    expect(detail.coverPath, 'cover.jpg');
    expect(detail.logoPath, 'logo.jpg');
  });
}
