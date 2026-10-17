import 'package:dalil_dimashq/data/datasource/remote/directory_api_client.dart';
import 'package:dalil_dimashq/data/dto/area_dto.dart';
import 'package:dalil_dimashq/data/dto/featured_now_dto.dart';
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
      'id,type,name_ar,name_en,area_id,stars,tourism_class',
    );
  }

  Future<List<AreaDto>> areaById(int id) {
    return _client.areaById('eq.$id', 'id,name_ar,name_en');
  }

  Future<List<FeaturedNowDto>> featuredNow(String placeId) {
    return _client.featuredNow('eq.$placeId');
  }

  Future<List<PhotoDto>> headerPhotos(String placeId) {
    return _client.photos(
      'eq.$placeId',
      'storage_path,is_cover,is_logo',
      '(is_cover.eq.true,is_logo.eq.true)',
      'eq.false',
    );
  }
}
