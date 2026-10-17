import 'package:dalil_dimashq/data/datasource/remote/directory_api_client.dart';
import 'package:dalil_dimashq/data/dto/area_dto.dart';
import 'package:dalil_dimashq/data/dto/featured_now_dto.dart';
import 'package:dalil_dimashq/data/dto/amenity_dto.dart';
import 'package:dalil_dimashq/data/dto/event_dto.dart';
import 'package:dalil_dimashq/data/dto/offer_dto.dart';
import 'package:dalil_dimashq/data/dto/photo_dto.dart';
import 'package:dalil_dimashq/data/dto/place_hour_dto.dart';
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
      'id,type,name_ar,name_en,area_id,stars,tourism_class,phones,lat,lon,description_ar,description_en,website,email,facebook,instagram',
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
      'id,place_id,title_ar,title_en,details_ar,details_en,starts_at,ends_at,photo_path',
    );
  }

  Future<List<OfferDto>> listOffers() {
    return _client.listOffers(
      'id,place_id,title_ar,title_en,details_ar,details_en,starts_at,ends_at,photo_path',
    );
  }

  Future<List<String>> amenityCodes(String placeId) async {
    final List<PlaceAmenityDto> rows = await _client.placeAmenities(
      'eq.$placeId',
      'amenity',
    );
    return rows.map((PlaceAmenityDto row) => row.amenity).toList();
  }

  Future<List<AmenityDto>> amenities() {
    return _client.amenities('code,name_ar,name_en');
  }

  Future<List<EventDto>> events() {
    return _client.events(
      'eq.published',
      'id,title_ar,title_en,venue_name,starts_at,poster_path,description_ar,description_en,venue_address,contact_phone,place_id,ends_at,publish_from,status',
      'starts_at.asc',
    );
  }

  Future<List<PlaceHourDto>> regularHours(String placeId) {
    return _client.placeHours(
      'eq.$placeId',
      'eq.regular',
      'weekday,opens,closes',
      'weekday.asc',
    );
  }
}
