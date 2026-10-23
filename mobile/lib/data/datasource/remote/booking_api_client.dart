import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'booking_api_client.g.dart';

@RestApi()
abstract class BookingApiClient {
  factory BookingApiClient(Dio dio, {String baseUrl}) = _BookingApiClient;

  @POST('/rest/v1/rpc/booking_availability')
  Future<dynamic> bookingAvailability(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/create_booking')
  Future<dynamic> createBooking(@Body() Map<String, dynamic> body);
}
