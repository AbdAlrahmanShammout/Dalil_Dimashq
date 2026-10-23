import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'notification_api_client.g.dart';

@RestApi()
abstract class NotificationApiClient {
  factory NotificationApiClient(Dio dio, {String baseUrl}) =
      _NotificationApiClient;

  @GET('/rest/v1/notifications')
  Future<dynamic> notifications(
    @Query('select') String select,
    @Query('order') String order,
  );

  @PATCH('/rest/v1/notifications')
  Future<void> markRead(
    @Query('id') String id,
    @Body() Map<String, dynamic> body,
  );
}
