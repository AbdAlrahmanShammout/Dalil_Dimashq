import 'package:dio/dio.dart';
import 'package:dalil_dimashq/core/config/app_config.dart';
import 'package:dalil_dimashq/core/network/auth_interceptor.dart';
import 'package:dalil_dimashq/core/storage/token_storage.dart';

class DioFactory {
  static Dio create(TokenStorage tokenStorage) {
    final Dio dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.supabaseUrl,
        connectTimeout: AppConfig.timeout,
        receiveTimeout: AppConfig.timeout,
      ),
    );
    dio.interceptors.add(AuthInterceptor(tokenStorage));
    const bool isRelease = bool.fromEnvironment('dart.vm.product');
    if (!isRelease) {
      dio.interceptors.add(
        LogInterceptor(requestBody: true, responseBody: true),
      );
    }
    return dio;
  }
}
