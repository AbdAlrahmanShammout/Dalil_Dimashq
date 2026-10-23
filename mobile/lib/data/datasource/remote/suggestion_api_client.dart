import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'suggestion_api_client.g.dart';

@RestApi()
abstract class SuggestionApiClient {
  factory SuggestionApiClient(Dio dio, {String baseUrl}) = _SuggestionApiClient;

  @POST('/rest/v1/suggestions')
  Future<void> create(@Body() Map<String, dynamic> body);
}
