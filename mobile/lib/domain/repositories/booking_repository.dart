import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_request.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class BookingRepository {
  Future<Either<Failure, BookingAvailability>> availability(String placeId);

  Future<Either<Failure, int>> create(BookingRequest request);

  Future<Either<Failure, BookingSummary>> find(int id);

  Future<Either<Failure, List<BookingSummary>>> list();

  Future<Either<Failure, String>> cancel(int id);

  Future<Either<Failure, int?>> reportId(int bookingId);

  Future<Either<Failure, void>> replyToReport({
    required int reportId,
    required String reply,
  });
}
