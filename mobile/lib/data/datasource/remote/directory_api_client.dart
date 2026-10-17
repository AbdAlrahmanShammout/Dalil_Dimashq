import 'package:dalil_dimashq/data/dto/area_dto.dart';
import 'package:dalil_dimashq/data/dto/featured_now_dto.dart';
import 'package:dalil_dimashq/data/dto/amenity_dto.dart';
import 'package:dalil_dimashq/data/dto/offer_dto.dart';
import 'package:dalil_dimashq/data/dto/photo_dto.dart';
import 'package:dalil_dimashq/data/dto/place_hour_dto.dart';
import 'package:dalil_dimashq/data/dto/place_row_dto.dart';
import 'package:dalil_dimashq/data/dto/search_places_request_dto.dart';
import 'package:dalil_dimashq/data/dto/search_places_response_dto.dart';
import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'directory_api_client.g.dart';

@RestApi()
abstract class DirectoryApiClient {
  factory DirectoryApiClient(Dio dio, {String baseUrl}) = _DirectoryApiClient;

  @POST('/rest/v1/rpc/search_places')
  Future<SearchPlacesResponseDto> searchPlaces(
    @Body() SearchPlacesRequestDto body,
  );

  @GET('/rest/v1/areas')
  Future<List<AreaDto>> listAreas(@Query('select') String select);

  @GET('/rest/v1/places')
  Future<List<PlaceRowDto>> places(
    @Query('id') String id,
    @Query('select') String select,
  );

  @GET('/rest/v1/areas')
  Future<List<AreaDto>> areaById(
    @Query('id') String id,
    @Query('select') String select,
  );

  @GET('/rest/v1/featured_now')
  Future<List<FeaturedNowDto>> featuredNow(@Query('place_id') String placeId);

  @GET('/rest/v1/photos')
  Future<List<PhotoDto>> photos(
    @Query('place_id') String placeId,
    @Query('select') String select,
    @Query('or') String orFilter,
    @Query('hidden') String hidden,
  );

  @GET('/rest/v1/offers')
  Future<List<OfferDto>> offers(
    @Query('place_id') String placeId,
    @Query('select') String select,
  );

  @GET('/rest/v1/place_amenities')
  Future<List<PlaceAmenityDto>> placeAmenities(
    @Query('place_id') String placeId,
    @Query('select') String select,
  );

  @GET('/rest/v1/amenities')
  Future<List<AmenityDto>> amenities(@Query('select') String select);

  @GET('/rest/v1/place_hours')
  Future<List<PlaceHourDto>> placeHours(
    @Query('place_id') String placeId,
    @Query('season') String season,
    @Query('select') String select,
    @Query('order') String order,
  );
}
