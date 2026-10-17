import 'package:dalil_dimashq/data/dto/profile_dto.dart';
import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'profile_api_client.g.dart';

@RestApi()
abstract class ProfileApiClient {
  factory ProfileApiClient(Dio dio, {String baseUrl}) = _ProfileApiClient;

  @GET('/rest/v1/profiles')
  Future<List<ProfileDto>> profiles(@Query('select') String select);

  @PATCH('/rest/v1/profiles')
  Future<List<ProfileDto>> updateProfile(
    @Body() Map<String, dynamic> body,
    @Header('Prefer') String prefer,
  );
}
