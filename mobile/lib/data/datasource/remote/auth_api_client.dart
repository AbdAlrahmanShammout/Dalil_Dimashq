import 'package:dalil_dimashq/data/dto/session_dto.dart';
import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'auth_api_client.g.dart';

@RestApi()
abstract class AuthApiClient {
  factory AuthApiClient(Dio dio, {String baseUrl}) = _AuthApiClient;

  @POST('/auth/v1/signup')
  Future<void> signUp(@Body() Map<String, dynamic> body);

  @POST('/auth/v1/token')
  Future<SessionDto> signIn(
    @Query('grant_type') String grantType,
    @Body() Map<String, dynamic> body,
  );

  @POST('/auth/v1/recover')
  Future<void> recover(@Body() Map<String, dynamic> body);

  @POST('/functions/v1/delete-account')
  Future<dynamic> deleteAccount();
}
