import 'package:dalil_dimashq/data/datasource/remote/directory_api_client.dart';
import 'package:dalil_dimashq/data/dto/area_dto.dart';
import 'package:dalil_dimashq/data/dto/featured_now_dto.dart';
import 'package:dalil_dimashq/data/dto/offer_dto.dart';
import 'package:dalil_dimashq/data/dto/photo_dto.dart';
import 'package:dalil_dimashq/data/dto/place_row_dto.dart';
import 'package:dalil_dimashq/data/dto/search_places_request_dto.dart';
import 'package:dalil_dimashq/data/dto/search_places_response_dto.dart';
import 'package:injectable/injectable.dart';

@lazySingleton
class DirectoryRemoteDataSource {
  DirectoryRemoteDataSource(this._client);

  final DirectoryApiClient _client;

  Future<SearchPlacesResponseDto> search(SearchPlacesRequestDto request) {
    return _client.searchPlaces(request);
  }

  Future<List<AreaDto>> areas() {
    return _client.listAreas('id,name_ar,name_en');
  }

  Future<List<PlaceRowDto>> placeById(String id) {
    return _client.places(
      'eq.$id',
      'id,type,name_ar,name_en,area_id,stars,tourism_class,phones,lat,lon',
    );
  }

  Future<List<AreaDto>> areaById(int id) {
    return _client.areaById('eq.$id', 'id,name_ar,name_en');
  }

  Future<List<FeaturedNowDto>> featuredNow(String placeId) {
    return _client.featuredNow('eq.$placeId');
  }

  Future<List<PhotoDto>> visiblePhotos(String placeId) {
    return _client.photos(
      'eq.$placeId',
      'id,storage_path,is_cover,is_logo',
      '(hidden.eq.false)',
      'eq.false',
    );
  }

  Future<List<OfferDto>> offers(String placeId) {
    return _client.offers(
      'eq.$placeId',
      'id,title_ar,title_en,details_ar,details_en,starts_at,ends_at,photo_path',
    );
  }
}
