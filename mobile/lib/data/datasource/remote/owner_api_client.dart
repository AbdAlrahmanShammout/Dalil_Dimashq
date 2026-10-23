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

  @GET('/rest/v1/subscriptions')
  Future<dynamic> subscriptions(@Query('select') String select);

  @GET('/rest/v1/change_requests')
  Future<dynamic> changeRequests(
    @Query('status') String status,
    @Query('select') String select,
  );
}
