import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dalil_dimashq/core/network/dio_factory.dart';
import 'package:dalil_dimashq/core/storage/token_storage.dart';

@module
abstract class RegisterModule {
  @preResolve
  Future<SharedPreferences> get preferences => SharedPreferences.getInstance();

  @lazySingleton
  Dio dio(TokenStorage tokenStorage) => DioFactory.create(tokenStorage);
}
