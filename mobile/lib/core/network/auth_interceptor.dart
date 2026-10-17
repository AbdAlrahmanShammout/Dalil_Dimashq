import 'package:dio/dio.dart';
import 'package:dalil_dimashq/core/config/app_config.dart';
import 'package:dalil_dimashq/core/storage/token_storage.dart';

class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._tokenStorage);
  final TokenStorage _tokenStorage;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    options.headers['apikey'] = AppConfig.supabaseAnonKey;
    final String? token = _tokenStorage.getToken();
    final String bearer = (token == null || token.isEmpty)
        ? AppConfig.supabaseAnonKey
        : token;
    options.headers['Authorization'] = 'Bearer $bearer';
    handler.next(options);
  }
}
