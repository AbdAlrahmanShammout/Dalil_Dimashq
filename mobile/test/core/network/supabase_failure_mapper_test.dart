import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

void main() {
  Failure mapCode(String code) {
    final RequestOptions options = RequestOptions(path: '/rest/v1/places');
    return mapSupabaseException(
      DioException(
        requestOptions: options,
        response: Response<Map<String, dynamic>>(
          requestOptions: options,
          statusCode: 400,
          data: <String, dynamic>{'code': code, 'message': code},
        ),
      ),
    );
  }

  test('maps 42501 to UnauthorizedFailure', () {
    expect(mapCode('42501'), isA<UnauthorizedFailure>());
  });

  test('maps 22023 to ValidationFailure', () {
    expect(mapCode('22023'), isA<ValidationFailure>());
  });

  test('maps P0002 to NotFoundFailure', () {
    expect(mapCode('P0002'), isA<NotFoundFailure>());
  });

  test('maps 54000 to ServerFailure', () {
    expect(mapCode('54000'), isA<ServerFailure>());
  });
}
