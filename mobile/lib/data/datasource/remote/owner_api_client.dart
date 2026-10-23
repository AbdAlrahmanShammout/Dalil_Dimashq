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

  @POST('/rest/v1/rpc/claim_with_code')
  Future<dynamic> claimWithCode(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/change_requests')
  Future<void> insertChangeRequest(@Body() Map<String, dynamic> body);

  @PATCH('/rest/v1/places')
  Future<void> updatePlace(
    @Query('id') String id,
    @Body() Map<String, dynamic> body,
  );
}
