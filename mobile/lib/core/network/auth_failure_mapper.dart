import 'package:dio/dio.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

Failure mapAuthException(DioException exception) {
  final String message = _authMessage(exception);
  if (message.toLowerCase().contains('email not confirmed')) {
    return EmailNotConfirmedFailure(message);
  }
  return mapSupabaseException(exception);
}

String _authMessage(DioException exception) {
  final Object? data = exception.response?.data;
  if (data is Map) {
    final Object? message =
        data['msg'] ?? data['error_description'] ?? data['message'];
    if (message is String && message.isNotEmpty) {
      return message;
    }
  }
  return exception.message ?? 'Request failed';
}
