import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'contact_api_client.g.dart';

@RestApi(baseUrl: 'https://dalil-dimashq.com')
abstract class ContactApiClient {
  factory ContactApiClient(Dio dio, {String baseUrl}) = _ContactApiClient;

  @POST('/api/contact')
  Future<void> send(@Body() Map<String, dynamic> body);
}
