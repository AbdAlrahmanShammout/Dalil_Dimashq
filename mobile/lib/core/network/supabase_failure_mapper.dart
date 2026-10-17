import 'package:dio/dio.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

const String _unauthorizedCode = '42501';
const String _invalidInputCode = '22023';
const String _uniqueViolationCode = '23505';
const String _notFoundCode = 'P0002';
const String _limitCode = '54000';
const String _objectStateCode = '55000';

Failure mapSupabaseException(DioException exception) {
  final Object? data = exception.response?.data;
  final String? code = data is Map<String, dynamic>
      ? data['code'] as String?
      : null;
  final String? serverMessage = data is Map<String, dynamic>
      ? data['message'] as String?
      : null;
  final String message = serverMessage ?? exception.message ?? 'Request failed';
  switch (code) {
    case _unauthorizedCode:
      return UnauthorizedFailure(message);
    case _invalidInputCode:
    case _uniqueViolationCode:
      return ValidationFailure(message);
    case _notFoundCode:
      return NotFoundFailure(message);
    case _limitCode:
    case _objectStateCode:
      return ServerFailure(message);
    default:
      return ServerFailure(message);
  }
}
