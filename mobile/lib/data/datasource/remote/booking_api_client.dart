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

  @POST('/rest/v1/rpc/confirm_booking')
  Future<dynamic> confirmBooking(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/reject_booking')
  Future<dynamic> rejectBooking(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/owner_cancel_booking')
  Future<dynamic> ownerCancelBooking(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/mark_booking')
  Future<dynamic> markBooking(@Body() Map<String, dynamic> body);

  @POST('/rest/v1/rpc/report_fake_booking')
  Future<dynamic> reportFakeBooking(@Body() Map<String, dynamic> body);

  @GET('/rest/v1/booking_settings')
  Future<dynamic> bookingSettings(
    @Query('place_id') String placeId,
    @Query('select') String select,
  );

  @POST('/rest/v1/rpc/set_booking_options')
  Future<void> setBookingOptions(@Body() Map<String, dynamic> body);

  @GET('/rest/v1/booking_response_hours')
  Future<dynamic> responseHours(
    @Query('place_id') String placeId,
    @Query('select') String select,
    @Query('order') String order,
  );

  @POST('/rest/v1/booking_response_hours')
  Future<void> insertResponseHour(@Body() Map<String, dynamic> body);

  @DELETE('/rest/v1/booking_response_hours')
  Future<void> deleteResponseHour(@Query('id') String id);

  @GET('/rest/v1/booking_blackouts')
  Future<dynamic> blackouts(
    @Query('place_id') String placeId,
    @Query('select') String select,
    @Query('order') String order,
  );

  @POST('/rest/v1/booking_blackouts')
  Future<void> insertBlackout(@Body() Map<String, dynamic> body);

  @DELETE('/rest/v1/booking_blackouts')
  Future<void> deleteBlackout(@Query('id') String id);

  @POST('/rest/v1/rpc/cancel_booking')
  Future<dynamic> cancelBooking(@Body() Map<String, dynamic> body);

  @GET('/rest/v1/fake_reports')
  Future<dynamic> fakeReports(
    @Query('booking_id') String bookingId,
    @Query('select') String select,
  );

  @POST('/rest/v1/rpc/reply_fake_report')
  Future<void> replyFakeReport(@Body() Map<String, dynamic> body);

  @GET('/rest/v1/booking_bans')
  Future<dynamic> bookingBans(
    @Query('lifted_at') String liftedAt,
    @Query('select') String select,
  );

  @GET('/rest/v1/booking_list')
  Future<dynamic> bookings(
    @Query('select') String select,
    @Query('order') String order,
  );

  @GET('/rest/v1/booking_list')
  Future<dynamic> placeBookings(
    @Query('place_id') String placeId,
    @Query('select') String select,
    @Query('order') String order,
  );

  @GET('/rest/v1/booking_list')
  Future<dynamic> bookingById(
    @Query('id') String id,
    @Query('select') String select,
  );
}
