import 'package:dalil_dimashq/data/dto/legal_document_dto.dart';
import 'package:dalil_dimashq/data/dto/profile_change_request_dto.dart';
import 'package:dalil_dimashq/data/dto/profile_dto.dart';
import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'profile_api_client.g.dart';

@RestApi()
abstract class ProfileApiClient {
  factory ProfileApiClient(Dio dio, {String baseUrl}) = _ProfileApiClient;

  @GET('/rest/v1/profiles')
  Future<List<ProfileDto>> profiles(@Query('select') String select);

  @GET('/rest/v1/profile_change_requests')
  Future<List<ProfileChangeRequestDto>> pendingProfileChanges(
    @Query('status') String status,
    @Query('select') String select,
  );

  @POST('/rest/v1/rpc/complete_profile')
  Future<dynamic> completeProfile(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/update_my_profile')
  Future<dynamic> updateMyProfile(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/request_profile_change')
  Future<dynamic> requestProfileChange(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/my_pending_legal')
  Future<List<LegalDocumentDto>> pendingLegal(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/accept_legal')
  Future<dynamic> acceptLegal(@Body() Map<String, dynamic> body);
}
