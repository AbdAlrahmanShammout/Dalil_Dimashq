import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'owner_api_client.g.dart';

@RestApi()
abstract class OwnerApiClient {
  factory OwnerApiClient(Dio dio, {String baseUrl}) = _OwnerApiClient;

  @GET('/rest/v1/place_owners')
  Future<dynamic> placeOwners(@Query('select') String select);

  @GET('/rest/v1/places')
  Future<dynamic> places(
    @Query('id') String id,
    @Query('select') String select,
  );

  @GET('/rest/v1/places')
  Future<dynamic> placesByName(
    @Query('or') String orFilter,
    @Query('select') String select,
  );

  @GET('/rest/v1/subscriptions')
  Future<dynamic> subscriptions(@Query('select') String select);

  @GET('/rest/v1/change_requests')
  Future<dynamic> changeRequests(
    @Query('status') String status,
    @Query('select') String select,
  );

  @GET('/rest/v1/change_requests')
  Future<dynamic> placeChangeRequests(
    @Query('place_id') String placeId,
    @Query('select') String select,
    @Query('order') String order,
  );

  @POST('/rest/v1/rpc/request_unlink')
  Future<dynamic> requestUnlink(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/claim_with_code')
  Future<dynamic> claimWithCode(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/change_requests')
  Future<void> insertChangeRequest(@Body() Map<String, dynamic> body);

  @GET('/rest/v1/amenities')
  Future<dynamic> amenities(@Query('select') String select);

  @GET('/rest/v1/place_amenities')
  Future<dynamic> placeAmenities(
    @Query('place_id') String placeId,
    @Query('select') String select,
  );

  @POST('/rest/v1/photos')
  Future<void> insertPhoto(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/set_cover_photo')
  Future<void> setCoverPhoto(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/set_logo_photo')
  Future<void> setLogoPhoto(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/offers')
  Future<void> insertOffer(@Body() Map<String, dynamic> body);

  @PATCH('/rest/v1/offers')
  Future<void> updateOffer(
    @Query('id') String id,
    @Body() Map<String, dynamic> body,
  );

  @DELETE('/rest/v1/offers')
  Future<void> deleteOffer(@Query('id') String id);

  @DELETE('/rest/v1/photos')
  Future<void> deletePhoto(@Query('id') String id);

  @POST('/rest/v1/place_amenities')
  Future<void> insertPlaceAmenity(@Body() Map<String, dynamic> body);

  @DELETE('/rest/v1/place_amenities')
  Future<void> deletePlaceAmenity(
    @Query('place_id') String placeId,
    @Query('amenity') String amenity,
  );

  @POST('/rest/v1/rpc/set_place_hours')
  Future<dynamic> setPlaceHours(@Body() Map<String, dynamic> body);

  @GET('/rest/v1/place_hours')
  Future<dynamic> placeHours(
    @Query('place_id') String placeId,
    @Query('select') String select,
  );

  @PATCH('/rest/v1/places')
  Future<void> updatePlace(
    @Query('id') String id,
    @Body() Map<String, dynamic> body,
  );
}
