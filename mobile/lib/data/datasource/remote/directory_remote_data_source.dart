import 'package:dalil_dimashq/data/datasource/remote/directory_api_client.dart';
import 'package:dalil_dimashq/data/dto/area_dto.dart';
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
}
