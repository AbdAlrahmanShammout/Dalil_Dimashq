import 'package:dalil_dimashq/data/dto/area_dto.dart';
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
}
